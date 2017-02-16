
import _ from 'lodash';

import { Component } from '@angular/core';
import './statistics.less';
import template from './statistics.html';

import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'statistics',
  providers: [StatisticsService],
  template
})
export class StatisticsComponent {
  static get parameters() {
    return [[StatisticsService]];
  }

  constructor(statisticsService) {
    this.statisticsService = statisticsService;
  }

  ngOnInit() {

    this.statisticsService.getStatistics()
      .subscribe(data => {
        this.statistics = data;

        this._professionData();
        this._petData();
        this._mapData();
      });
  }

  _professionData() {
    const labels = _.map(this.statistics.professions, '_id');
    const data   = _.map(this.statistics.professions, 'count');

    this.professionData = { labels, data };
  }

  _petData() {
    const labels = _.map(this.statistics.pets, '_id');
    const data   = _.map(this.statistics.pets, 'count');

    this.petData = { labels, data };
  }

  _mapData() {
    const countMaps = _(this.statistics.maps).sortBy('count').take(10).value();
    const labels = _.map(countMaps, '_id');
    const data   = _.map(countMaps, 'count');

    this.mapData = { labels, data };
  }
}