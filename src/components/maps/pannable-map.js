
import _ from 'lodash';

import { Component, NgZone, EventEmitter } from '@angular/core';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');

import { settings } from '../../services/primus';

const baseUrl = `${settings.protocol}://${settings.cdn ? settings.cdn : settings.hostname}:${settings.port}`;

class Game {

  constructor({ mapName, mapPath, onPan, startX, startY }) {
    this.mapName = mapName;
    this.mapPath = mapPath;
    this.onPan = onPan;
    this.startX = startX;
    this.startY = startY;

    this.itemText = '';

    this.camera = null;
    this.cameraDrag = 5;
    this.cameraAccel = 3;
    this.camMaxSpeed = 80;

    this.camVelX = 0;
    this.camVelY = 0;
  }

  dragCamera(pointer) {
    if(!pointer.isDown) return;

    if(pointer.isDown) {
      if(this.camera) {
        this.camVelX = (this.camera.x - pointer.position.x) * this.cameraAccel;
        this.camVelY = (this.camera.y - pointer.position.y) * this.cameraAccel;
      }

      this.camera = pointer.position.clone();
    }

    if(pointer.isUp) {
      this.camera = null;
    }

  }

  updateCamera() {
    this.camVelX = window.Phaser.Math.clamp(this.camVelX, -this.camMaxSpeed, this.camMaxSpeed);
    this.camVelY = window.Phaser.Math.clamp(this.camVelY, -this.camMaxSpeed, this.camMaxSpeed);

    this.game.camera.x += this.camVelX;
    this.game.camera.y += this.camVelY;

    if(this.camVelX > this.cameraDrag) {
      this.camVelX -= this.cameraDrag;
    } else if(this.camVelX < -this.cameraDrag) {
      this.camVelX += this.cameraDrag;
    } else {
      this.camVelX = 0;
    }

    if(this.camVelY > this.cameraDrag) {
      this.camVelY -= this.cameraDrag;
    } else if(this.camVelY < -this.cameraDrag) {
      this.camVelY += this.cameraDrag;
    } else {
      this.camVelY = 0;
    }
  }

  cacheMap(mapName, mapData) {
    this.game.load.tilemap(mapName, null, mapData, window.Phaser.Tilemap.TILED_JSON);
  }

  hoverText() {
    const x = Math.floor((this.game.camera.x + this.game.input.x) / 16);
    const y = Math.floor((this.game.camera.y + this.game.input.y) / 16);
    return `Hovering (${x}, ${y})\n${this.itemText}`;
  }

  setObjectData(mapName, map) {
    if(!map || !map.data.layers[2]) return;
    _.each(map.data.layers[2].objects, object => {
      object.properties = {
        realtype:           object.type,
        teleportX: parseInt(object.properties.destx || 0),
        teleportY: parseInt(object.properties.desty || 0),
        teleportMap:        object.properties.map,
        teleportLocation:   object.properties.toLoc,
        requireBoss:        object.properties.requireBoss,
        requireCollectible: object.properties.requireCollectible,
        requireAchievement: object.properties.requireAchievement,
        requireClass:       object.properties.requireClass,
        requireRegion:      object.properties.requireRegion,
        requireMap:         object.properties.requireMap,
        flavorText:         object.properties.flavorText,
        requireHoliday:     object.properties.requireHoliday
      };
    });

    // re-cache the tilemap with the new data
    this.game.cache.removeTilemap(mapName);
    this.cacheMap(mapName, map.data);
  }

  createObjectData() {

    _.each(this.objectGroup.children, child => {

      child.inputEnabled = true;

      child.events.onInputOver.add(() => {

        this.itemText = '';

        const nameKey = child.teleportMap ? 'teleportMap' : 'name';

        if(child.realtype && child.realtype !== 'Door') {
          this.itemText = `${child.realtype}: ${child[nameKey]}`;
        }

        if(child.flavorText) this.itemText += `\n\"${child.flavorText}\"`;

        let requires = false;
        let requirementText = '\nRequirements\n-------------------';
        if(child.requireAchievement) requires=true;requirementText += `\nAchievement: ${child.requireAchievement}`;
        if(child.requireBoss)        requires=true;requirementText += `\nBoss Kill: ${child.requireBoss}`;
        if(child.requireClass)       requires=true;requirementText += `\nClass: ${child.requireClass}`;
        if(child.requireCollectible) requires=true;requirementText += `\nCollectible: ${child.requireCollectible}`;
        if(child.requireHoliday)     requires=true;requirementText += `\nHoliday: ${child.requireHoliday}`;
        if(child.requireRegion)      requires=true;requirementText += `\nRegion Visited: ${child.requireRegion}`;
        if(child.requireMap)         requires=true;requirementText += `\nMap Visited: ${child.requireMap}`;

        if(requires) this.itemText = `${this.itemText}\n${requirementText}`;
      });

      child.events.onInputOut.add(() => this.itemText = '');
    });

  }

  createMap() {
    if(!this.game.cache.checkTilemapKey(this.mapName)) return;
    this.setObjectData(this.mapName, this.game.cache.getTilemapData(this.mapName));
    const map = this.game.add.tilemap(this.mapName);
    map.addTilesetImage('tiles', 'tiles');

    const terrain = map.createLayer('Terrain');
    terrain.resizeWorld();
    map.createLayer('Blocking');

    this.objectGroup = this.game.add.group();

    for(let i = 1; i <=100; i++) {
      map.createFromObjects('Interactables', i, 'interactables', i-1, true, false, this.objectGroup);
    }

    const textOptions = { font: '15px Arial', fill: '#fff', stroke: '#000', strokeThickness: 3, wordWrap: true, wordWrapWidth: 500 };
    this.text = this.game.add.text(10, 10, this.hoverText(), textOptions);
    this.text.fixedToCamera = true;

    this.createObjectData();

    if(this.startX && this.startY) {
      this.game.camera.focusOnXY(this.startX*16, this.startY*16);
    }
  }

  preload() {
    this._currentMapName = this.mapName;
    this.game.stage.disableVisibilityChange = true;
    this.game.load.image('tiles', `${baseUrl}/maps/img/tiles.png`, 16, 16);
    this.game.load.spritesheet('interactables', `${baseUrl}/maps/img/tiles.png`, 16, 16);
    this.game.load.tilemap(this.mapName, `${baseUrl}/maps/world-maps/${this.mapPath}`, null, window.Phaser.Tilemap.TILED_JSON);
  }

  create() {
    this.createMap();
  }

  update() {
    if(this._currentMapName !== this.mapName) {
      this.game.state.restart();
      // this.createMap();
      this.itemText = '';
    }

    this._currentMapName = this.mapName;

    this.text.text = this.hoverText();

    this.dragCamera(this.game.input.mousePointer);
    this.updateCamera();

    if(this.game.input.mousePointer.isDown) {
      this.onPan({
        x: Math.floor((this.game.camera.view.x+this.game.input.x) / 16),
        y: Math.floor((this.game.camera.view.y+this.game.input.y) / 16)
      });
    }
  }
}

@Component({
  selector: '[pannable-map]',
  inputs: ['activeMap', 'x', 'y'],
  outputs: ['onPan'],
  template: '<div id="map">'
})
export class PannableMap {

  static get parameters() {
    return [[NgZone]];
  }

  constructor(ngZone) {
    this.ngZone = ngZone;
    this.onPan = new EventEmitter();
  }

  loadMap() {
    return this.setMapData();
  }

  setMapData(/* mapName, mapData */) {
    if(!this.game) {
      this.ngZone.runOutsideAngular(() => {
        this._gameObj = new Game({
          mapName: this.mapName,
          mapPath: this.mapPath,
          startX: this.x,
          startY: this.y,
          onPan: (data) => this.onPan.emit(data)
        });
        this.game = new window.Phaser.Game(window.innerWidth * 0.75, window.innerHeight - 54, window.Phaser.CANVAS, 'map', this._gameObj);
        this._gameObj.game = this.game;
      });
    } else {
      // this._gameObj.cacheMap(mapName, mapData);
    }
  }

  ngOnInit() {
    this.mapName = this.activeMap.name;
    this.mapPath = this.activeMap.path;
    this.loadMap();
  }

  ngOnChanges(changes) {
    if(!changes.activeMap || !changes.activeMap.currentValue || _.isEqual(changes.activeMap.currentValue, changes.activeMap.previousValue)) return;
    const { name, path } = changes.activeMap.currentValue;
    this.mapName = name;
    this.mapPath = path;

    if(this._gameObj) {
      this._gameObj._currentMapName = name;
      this._gameObj.mapPath = path;
    }

  }

  ngOnDestroy() {

    if(this.game) {
      this.game.destroy();
    }

    const elements = document.getElementsByTagName('canvas');
    while(elements[0]) elements[0].parentNode.removeChild(elements[0]);
  }
}
