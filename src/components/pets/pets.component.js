
import _ from 'lodash';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import template from './pets.html';
import './pets.less';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { PetService } from '../../services/pet.service';

@Component({
  directives: [ROUTER_DIRECTIVES],
  providers: [PetService],
  template
})
export class PetsComponent {
  static get parameters() {
    return [[PetService]];
  }

  constructor(petService) {
    this.petService = petService;
    this.allPlayers = [];
    this.userSort = 'name';
    this.userFilter = undefined;
    this.userFilterCriteria = '';
    this.userReverse = false;
    this.filterKeys = [
      { name: 'Name',       value: 'name' },
      { name: 'Level',      value: 'level' },
      { name: 'Profession', value: 'professionName' },
      { name: 'Owner',      value: 'owner' },
      { name: 'Type',       value: 'type' }
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
        return _.isNumber(player[this.userSort]) ? player[this.userSort] : (''+player[this.userSort]).toLowerCase();
      })
      .value();

    if(this.userReverse) baseVal = _.reverse(baseVal);

    this.allPlayersDisplay = baseVal;
  }

  ngOnInit() {
    Observable.timer(0, 30000)
      .flatMap(() => {
        return this.petService.getAllPets();
      }).subscribe(data => {
        this.setAllPlayers(data);
      });
  }
}