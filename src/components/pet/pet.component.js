
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './pet.html';
import './pet.less';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { PrimusWrapper } from '../../services/primus';

import { OverviewComponent } from './components/overview/overview.component';
import { EquipmentComponent } from './components/equipment/equipment.component';

@Component({
  directives: [ROUTER_DIRECTIVES, OverviewComponent, EquipmentComponent],
  providers: [PrimusWrapper],
  template
})
export class PetComponent {
  static get parameters() {
    return [[PrimusWrapper], [ActivatedRoute]];
  }

  constructor(primus, route) {
    this.primus = primus;
    this.route = route;
    this.player = {};

    this.navItems = [
      { name: 'Overview',     value: 'overview' },
      { name: 'Equipment',    value: 'equipment' }
    ];

    this.changeNav('overview');
  }

  changeNav(newNav) {
    this.activeNav = newNav;
  }

  setPlayer(data) {
    this.player = data;
    this.equipment = _.flattenDeep(_.values(data.equipment));
  }

  ngOnInit() {
    this.playerSubscription = this.primus.contentUpdates.pet.subscribe(data => this.setPlayer(data));

    this.route.params.subscribe(params => {
      this.primus.initSocket();
      this.primus.requestPet(decodeURI(params.name));
    });
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();

    this.primus.killSocket();
  }
}