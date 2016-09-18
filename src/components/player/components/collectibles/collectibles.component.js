
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './collectibles.html';

@Component({
  selector: 'collectibles',
  inputs: ['player'],
  template
})
export class CollectiblesComponent {
  ngOnInit() {
    this.collectibles = _.sortBy(_.keys(this.player));
  }
}