
import _ from 'lodash';

import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import template from './titlebar.html';
import './titlebar.less';

@Component({
  selector: 'titlebar',
  directives: [ROUTER_DIRECTIVES],
  template
})
export class TitleBarComponent {
  static get parameters() {
    return [[Router]];
  }

  constructor(router) {
    this.router = router;
  }

  hasActiveRoute(route) {
    return _.includes(this.router.url, route);
  }
}