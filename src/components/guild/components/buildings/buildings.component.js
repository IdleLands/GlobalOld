
import * as _ from 'lodash';
import { Component } from '@angular/core';
import template from './buildings.html';

@Component({
  selector: 'buildings',
  inputs: ['buildings'],
  template
})
export class BuildingsComponent {

  ngOnInit() {
    this.buildingKeys = _.keys(this.buildings.levels);
  }
}