
// import _ from 'lodash';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import template from './guilds.html';
import './guilds.less';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { GuildService } from '../../services/guild.service';

@Component({
  directives: [ROUTER_DIRECTIVES],
  providers: [GuildService],
  template
})
export class GuildsComponent {
  static get parameters() {
    return [[GuildService]];
  }

  constructor(guildService) {
    this.guildService = guildService;
    this.allGuilds = [];
  }

  setAllGuilds(data) {
    this.allGuilds = data;
  }

  ngOnInit() {
    Observable.timer(0, 30000)
      .flatMap(() => {
        return this.guildService.getAllGuilds();
      }).subscribe(data => {
        this.setAllGuilds(data);
      });
  }
}