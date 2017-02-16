
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './maps.html';
import './maps.less';

import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { MapsService } from '../../services/maps.service';

import { PannableMap } from './pannable-map';

@Component({
  directives: [ROUTER_DIRECTIVES, PannableMap],
  providers: [MapsService],
  template
})
export class MapsComponent {
  static get parameters() {
    return [[MapsService], [Router]];
  }

  constructor(mapService, router) {
    this.mapService = mapService;
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
    this._current = { x, y };
    this._change(this._current);
  }

  _change({ mapName, x, y }) {

    if(!mapName) mapName = this.activeMap.name || this.default.map;
    if(!_.isNumber(x)) x = this._current.x || this.default.x;
    if(!_.isNumber(y)) y = this._current.y || this.default.y;

    this._x = _.isNaN(x) ? 0 : x;
    this._y = _.isNaN(y) ? 0 : y;
    
    this.router.navigate(['/maps'], { queryParams: { map: mapName, x, y } });
  }

  setAllMaps(data) {
    if(!data.maps) return;
    this.allMaps = data.maps;
    this.changeMap(this.default.map || 'Norkos', true);

    this.isReady = true;
  }

  ngOnInit() {
    const { x, y, map } = this.router.routerState.snapshot.queryParams;

    this.default = {
      x: +x,
      y: +y,
      map: decodeURI(map)
    };

    if(_.isNaN(this.default.x))                               this.default.x = 0;
    if(_.isNaN(this.default.y))                               this.default.y = 0;
    if(!this.default.map || this.default.map === 'undefined') this.default.map = 'Norkos';

    this.mapService.getAllMaps()
      .subscribe(data => {
        this.setAllMaps(data);
      });
  }
}