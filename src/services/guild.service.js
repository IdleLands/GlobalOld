
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseURL } from './baseURL';

@Injectable()
export class GuildService {

  static get parameters() {
    return [[Http]];
  }

  constructor(http) {
    this.http = http;
  }

  getAllGuilds() {
    return this.http.get(`${BaseURL.url}/guilds`)
      .map(res => res.json().guilds);
  }

  getGuild(guildName) {
    return this.http.get(`${BaseURL.url}/guilds/${guildName}`)
      .map(res => res.json().guild);
  }
}