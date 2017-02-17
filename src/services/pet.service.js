
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class PetService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getAllPets() {
    return this.http.get(`${BaseURL.url}/pets`)
      .map(res => res.json().pets);
  }

  getPet(playerId) {
    return this.http.get(`${BaseURL.url}/pets/${playerId}`)
      .map(res => res.json().pet);
  }
}