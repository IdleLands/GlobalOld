
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './maps.html';
import './maps.less';

import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { PrimusWrapper } from '../../services/primus';

import { PannableMap } from './pannable-map';

@Component({
  directives: [ROUTER_DIRECTIVES, PannableMap],
  providers: [PrimusWrapper],
  template
})
export class MapsComponent {
  static get parameters() {
    return [[PrimusWrapper], [Router]];
  }

  constructor(primus, router) {
    this.primus = primus;
    this.router = router;
    this.allMaps = [];
    this._current = {};
  }

  changeMap(newMapName = 'Norkos', isLoad = false) {
    this.activeMap = _.find(this.allMaps, { name: newMapName });
    const opts = { mapName: newMapName };
    if(!isLoad) {
      opts.x = opts.y = 0;
    }
    this._change(opts);
  }

  changeCoords({ x, y }) {
    if(this._blockNextPan) {
      this._blockNextPan = false;
      return;
    }
    this._current = { x, y };
    this._change(this._current);
  }

  onMapChange({ x, y, map }) {
    this.activeMap = _.find(this.allMaps, { name: map });
    this._x = x;
    this._y = y;
    this._current = { x, y };

    this._blockNextPan = true;
    this._change({ mapName: map, x, y });
  }

  _change({ mapName, x, y }) {

    if(!mapName) mapName = this.activeMap.name || this.default.map;
    if(!_.isNumber(x)) x = this._current.x || this.default.x;
    if(!_.isNumber(y)) y = this._current.y || this.default.y;

    this._x = _.isNaN(x) ? 0 : x;
    this._y = _.isNaN(y) ? 0 : y;

    console.log(mapName, x, y, new Error().stack);

    this.router.navigate(['/maps'], { queryParams: { map: mapName, x, y } });
  }

  setAllMaps(data) {
    if(!data.maps || !data.teleports) return;
    this.allMaps = data.maps;
    this.allTeleports = data.teleports;
    this.changeMap(this.default.map || 'Norkos', true);

    this.isReady = true;
  }

  ngOnInit() {
    this.mapSubscription = this.primus.contentUpdates.maps.subscribe(data => this.setAllMaps(data));
    const { x, y, map } = this.router.routerState.snapshot.queryParams;

    this.default = {
      x: +x,
      y: +y,
      map: decodeURI(map)
    };

    if(_.isNaN(this.default.x))                               this.default.x = 0;
    if(_.isNaN(this.default.y))                               this.default.y = 0;
    if(!this.default.map || this.default.map === 'undefined') this.default.map = 'Norkos';

    this.primus.initSocket();
    this.primus.requestGlobalMaps();
  }

  ngOnDestroy() {
    this.mapSubscription.unsubscribe();

    this.primus.killSocket();
  }
}