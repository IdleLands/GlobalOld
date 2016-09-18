
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

  changeMap(newMapName, isLoad = false) {
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

    this._x = x;
    this._y = y;

    this.router.navigate(['/maps'], { queryParams: { map: mapName, x, y } });
  }

  setAllMaps(data) {
    if(!data.length) return;
    this.allMaps = data;
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

    this.primus.initSocket();
    this.primus.requestGlobalMaps();
  }

  ngOnDestroy() {
    this.mapSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();

    this.primus.killSocket();
  }
}