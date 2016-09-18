
import _ from 'lodash';

import { Component } from '@angular/core';
import template from './statistics.html';

import { StatisticsTree } from '../../../_shared/statistics.tree.component';

@Component({
  selector: 'statistics',
  directives: [StatisticsTree],
  inputs: ['player'],
  template
})
export class StatisticsComponent {
  setStatistics(data) {

    const recurse = (obj) => {
      return _.map(obj, (val, key) => {
        const baseObject = {};

        baseObject.name = key;

        if(_.isObject(val)) {
          baseObject.children = recurse(val);
        } else {
          baseObject.val = val;
        }

        return baseObject;
      });
    };

    const sortAll = (data) => {
      _.each(data, obj => {
        if(obj.children) obj.children = sortAll(obj.children);
      });
      return _.sortBy(data, 'name');
    };

    this.statistics = sortAll(recurse(data));
  }

  ngOnInit() {
    this.setStatistics(this.player);
  }
}