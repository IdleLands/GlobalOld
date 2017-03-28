
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import template from './guild.html';
import './guild.less';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';

import { GuildService } from '../../services/guild.service';

import { OverviewComponent } from './components/overview/overview.component';
import { MembersComponent } from './components/members/members.component';
import { BuildingsComponent } from './components/buildings/buildings.component';

@Component({
  directives: [ROUTER_DIRECTIVES, OverviewComponent, MembersComponent, BuildingsComponent],
  providers: [GuildService],
  template
})
export class GuildComponent {
  static get parameters() {
    return [[GuildService], [ActivatedRoute]];
  }

  constructor(guildService, route) {
    this.guildService = guildService;
    this.route = route;
    this.guild = {};

    this.navItems = [
      { name: 'Overview',     value: 'overview' },
      { name: 'Members',      value: 'members' },
      { name: 'Buildings',    value: 'buildings' }
    ];

    this.changeNav('overview');
  }

  changeNav(newNav) {
    this.activeNav = newNav;
  }

  setGuild(data) {
    this.guild = data;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      Observable.timer(0, 30000)
        .flatMap(() => {
          return this.guildService.getGuild(decodeURI(params.name));
        }).subscribe(data => {
          this.setGuild(data);
        });
    });
  }
}