
import _ from 'lodash';

export class BaseURL {
  static get url() {

    let url = 'http://localhost:3000';
    if(_.includes(window.location.href, 'idle.land')) url = 'http://globalapi.idle.land';

    return url;
  }

  static get idleUrl() {

    let url = 'http://localhost:8080';
    if(_.includes(window.location.href, 'idle.land')) url = 'http://game.idle.land';

    return url;
  }
}