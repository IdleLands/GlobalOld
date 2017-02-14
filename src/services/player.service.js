
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class PlayerService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getAllPlayers() {
    return this.http.get(`${BaseURL.url}/players`)
      .map(res => res.json().players);
  }
}