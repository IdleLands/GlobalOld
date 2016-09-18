
import Primus from '../../primus.gen';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const settings = window.location.hostname === 'global.idle.land' ?
  { port: 80,   protocol: 'http', hostname: 'game.idle.land', cdn: 'd24x6kjuc2wq9m.cloudfront.net' } :
  { port: 8080, protocol: 'http', hostname: window.location.hostname };

export class PrimusWrapper {

  constructor() {
    this.outstandingCallbacks = {};

    this._contentUpdates = {
      onlineUsers: new BehaviorSubject([]),
      maps:        new BehaviorSubject({})
    };

    this.contentUpdates = {
      onlineUsers: this._contentUpdates.onlineUsers.asObservable(),
      maps:        this._contentUpdates.maps.asObservable()
    };
  }

  killSocket() {
    if(!this.socket) return;
    this.socket.end();
  }

  initSocket() {
    if(this.socket) return;
    this.socket = Primus.connect(`${settings.protocol}://${settings.hostname}:${settings.port}`, {
      reconnect: {
        min: 500,
        retries: 30,
        factor: 2
      }
    });

    window.socket = this.socket;

    this.socket.on('data', data => {

      // data updates are handled differently
      if(data.update) return this.handleContentUpdate(data);

      // generic event ping-pong
      if(!this.outstandingCallbacks[data.event]) return;
      this.outstandingCallbacks[data.event](data);
      this.outstandingCallbacks[data.event] = null;
    });
  }

  handleContentUpdate(content) {
    if(!content.update) return;
    this._contentUpdates[content.update].next(content.data);
  }

  emit(event, data, callback) {
    this.outstandingCallbacks[event] = callback;
    this.socket.emit(event, data);
  }

  requestGlobalPlayers() {
    this.emit('plugin:global:allplayers');
  }

  requestGlobalMaps() {
    this.emit('plugin:global:allmaps');
  }

}