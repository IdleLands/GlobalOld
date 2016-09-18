
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './achievements.html';

@Component({
  selector: 'achievements',
  inputs: ['player'],
  template
})
export class AchievementsComponent {
  ngOnInit() {
    this.achievements = _.keys(this.player);
  }
}