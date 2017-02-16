
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class StatisticsService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getStatistics() {
    return this.http.get(`${BaseURL.url}/statistics`)
      .map(res => res.json());
  }
}