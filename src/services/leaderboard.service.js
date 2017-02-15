
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class LeaderboardService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getLeaderboard() {
    return this.http.get(`${BaseURL.url}/leaderboard`)
      .map(res => res.json());
  }
}