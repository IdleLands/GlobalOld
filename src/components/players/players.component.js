
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './players.html';
import './players.less';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { PrimusWrapper } from '../../services/primus';

@Component({
  directives: [ROUTER_DIRECTIVES],
  providers: [PrimusWrapper],
  template
})
export class PlayersComponent {
  static get parameters() {
    return [[PrimusWrapper]];
  }

  constructor(primus) {
    this.primus = primus;
    this.allPlayers = [];
    this.userSort = 'name';
    this.userFilter = undefined;
    this.userFilterCriteria = '';
    this.userReverse = false;
    this.filterKeys = [
      { name: 'Name',       value: 'name' },
      { name: 'Level',      value: 'level' },
      { name: 'Profession', value: 'professionName' },
      { name: 'Map',        value: 'map' }
    ];
  }

  setAllPlayers(data) {
    this.allPlayers = data;
    this._applySortAndFilter();
  }

  changeSort($event) {
    this.userSort = $event.target.value;
    this._applySortAndFilter();
  }

  changeFilter($event) {
    this.userFilter = $event.target.value;
    this.userFilterCriteria = '';
    this._applySortAndFilter();
  }

  changeReverse() {
    this.userReverse = !this.userReverse;
    this._applySortAndFilter();
  }

  _applySortAndFilter() {
    let baseVal = _(this.allPlayers)
      .filter(player => {
        if(!this.userFilter || !this.userFilterCriteria) return true;
        return _.includes((''+player[this.userFilter]).toLowerCase(), this.userFilterCriteria.toLowerCase());
      })
      .sortBy(player => {
        return (''+player[this.userSort]).toLowerCase();
      })
      .value();

    if(this.userReverse) baseVal = _.reverse(baseVal);

    this.allPlayersDisplay = baseVal;
  }

  ngOnInit() {
    this.playerSubscription = this.primus.contentUpdates.onlineUsers.subscribe(data => this.setAllPlayers(data));

    this.primus.initSocket();
    this.primus.requestGlobalPlayers();
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();

    this.primus.killSocket();
  }
}