
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './pets.html';

import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'pets',
  directives: [ROUTER_DIRECTIVES],
  inputs: ['player'],
  template
})
export class PetsComponent {
  ngOnInit() {
    this.pets = _.sortBy(_.keys(this.player.allPets));
    this.activePetId = this.player.activePetId;
  }
}