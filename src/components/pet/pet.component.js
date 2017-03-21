
import _ from 'lodash';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import template from './pet.html';
import './pet.less';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { PetService } from '../../services/pet.service';

import { OverviewComponent } from './components/overview/overview.component';
import { EquipmentComponent } from './components/equipment/equipment.component';

@Component({
  directives: [ROUTER_DIRECTIVES, OverviewComponent, EquipmentComponent],
  providers: [PetService],
  template
})
export class PetComponent {
  static get parameters() {
    return [[PetService], [ActivatedRoute]];
  }

  constructor(petService, route) {
    this.petService = petService;
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
    this.route.params.subscribe(params => {
      Observable.timer(0, 30000)
        .flatMap(() => {
          return this.petService.getPet(decodeURI(params.name));
        }).subscribe(data => {
          this.setPlayer(data);
        });
    });
  }
}