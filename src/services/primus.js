
import Primus from '../../primus.gen';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const settings = window.location.hostname === 'global.idle.land' ?
  { port: 80,   protocol: 'http', hostname: 'game.idle.land' /* , cdn: 'd24x6kjuc2wq9m.cloudfront.net' */ } :
  { port: 8080, protocol: 'http', hostname: window.location.hostname };

export class PrimusWrapper {

  constructor() {
    this.outstandingCallbacks = {};

    this._contentUpdates = {
      onlineUsers: new BehaviorSubject([]),
      player:      new BehaviorSubject({}),
      maps:        new BehaviorSubject({}),
      pets:        new BehaviorSubject([]),
      pet:         new BehaviorSubject({})
    };

    this.contentUpdates = {
      onlineUsers: this._contentUpdates.onlineUsers.asObservable(),
      player:      this._contentUpdates.player.asObservable(),
      maps:        this._contentUpdates.maps.asObservable(),
      pets:        this._contentUpdates.pets.asObservable(),
      pet:         this._contentUpdates.pet.asObservable()
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

  requestPet(playerName) {
    this.emit('plugin:global:pet', { playerName });
  }

  requestPlayer(playerName) {
    this.emit('plugin:global:player', { playerName });
  }

  requestGlobalPlayers() {
    this.emit('plugin:global:allplayers');
  }

  requestGlobalPets() {
    this.emit('plugin:global:allpets');
  }

  requestGlobalMaps() {
    this.emit('plugin:global:allmaps');
  }

}