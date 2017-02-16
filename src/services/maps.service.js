
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class MapsService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getAllMaps() {
    return this.http.get(`${BaseURL.idleUrl}/maps`)
      .map(res => res.json());
  }
}