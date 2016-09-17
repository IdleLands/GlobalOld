
import { Component } from '@angular/core';
import template from './home.html';
import './home.less';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { PrimusWrapper } from '../../services/primus';

@Component({
  directives: [ROUTER_DIRECTIVES],
  providers: [PrimusWrapper],
  template
})
export class HomeComponent {
  static get parameters() {
    return [[PrimusWrapper]];
  }

  constructor(primus) {
    this.primus = primus;
    this.allPlayers = [];
  }

  setAllPlayers(data) {
    this.allPlayers = data;
    console.log(data);
  }

  ngOnInit() {
    this.playerSubscription = this.primus.contentUpdates.onlineUsers.subscribe(data => this.setAllPlayers(data));

    this.primus.initSocket();
    this.primus.requestGlobalPlayers();
  }

  ngOnDestroy() {
    this.playerSubscription.unsubscribe();

    this.primus.killSocket();
  }
}