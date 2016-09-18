
// import _ from 'lodash';

import { Component } from '@angular/core';
import template from './player.html';
import './player.less';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { PrimusWrapper } from '../../services/primus';

import { OverviewComponent } from './components/overview/overview.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { CollectiblesComponent } from './components/collectibles/collectibles.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

@Component({
  directives: [ROUTER_DIRECTIVES, OverviewComponent, EquipmentComponent, AchievementsComponent, CollectiblesComponent, StatisticsComponent],
  providers: [PrimusWrapper],
  template
})
export class PlayerComponent {
  static get parameters() {
    return [[PrimusWrapper], [ActivatedRoute]];
  }

  constructor(primus, route) {
    this.primus = primus;
    this.route = route;
    this.player = {};

    this.navItems = [
      { name: 'Overview',     value: 'overview' },
      { name: 'Equipment',    value: 'equipment' },
      { name: 'Achievements', value: 'achievements' },
      { name: 'Collectibles', value: 'collectibles' },
      { name: 'Statistics',   value: 'statistics' }
    ];

    this.changeNav('overview');
  }

  changeNav(newNav) {
    this.activeNav = newNav;
  }

  setPlayer(data) {
    this.player = data;
  }

  ngOnInit() {
    this.playerSubscription = this.primus.contentUpdates.player.subscribe(data => this.setPlayer(data));

    this.route.params.subscribe(params => {
      this.primus.initSocket();
      this.primus.requestPlayer(decodeURI(params.name));
    });
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();

    this.primus.killSocket();
  }
}