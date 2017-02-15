
// import _ from 'lodash';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import template from './player.html';
import './player.less';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { PlayerService } from '../../services/player.service';

import { OverviewComponent } from './components/overview/overview.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { CollectiblesComponent } from './components/collectibles/collectibles.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { PetsComponent } from './components/pets/pets.component';

@Component({
  directives: [ROUTER_DIRECTIVES, OverviewComponent, EquipmentComponent, AchievementsComponent, CollectiblesComponent, StatisticsComponent, PetsComponent],
  providers: [PlayerService],
  template
})
export class PlayerComponent {
  static get parameters() {
    return [[PlayerService], [ActivatedRoute]];
  }

  constructor(playerService, route) {
    this.playerService = playerService;
    this.route = route;
    this.player = {};

    this.navItems = [
      { name: 'Overview',     value: 'overview' },
      { name: 'Equipment',    value: 'equipment' },
      { name: 'Achievements', value: 'achievements' },
      { name: 'Collectibles', value: 'collectibles' },
      { name: 'Statistics',   value: 'statistics' },
      { name: 'Pets',         value: 'pets' }
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
    this.route.params.subscribe(params => {
      Observable.timer(0, 5000)
        .flatMap(() => {
          return this.playerService.getPlayer(decodeURI(params.name));
        }).subscribe(player => {
          this.setPlayer(player);
        });
    });
  }

}