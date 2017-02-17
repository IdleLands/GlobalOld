
import { Component } from '@angular/core';
import template from './overview.html';

@Component({
  selector: 'overview',
  inputs: ['player'],
  template
})
export class OverviewComponent {
  constructor() {
    this.baseStats = ['str', 'con', 'dex', 'agi', 'int', 'luk'];
  }

  backgroundForPlayer() {
    console.log(this.player);
    const percent = Math.round(100 * (this.player._xp.__current / this.player._xp.maximum));
    const xpColor = '#cfc';
    return `linear-gradient(90deg, ${xpColor} 0%, ${xpColor} ${percent}%, #fff ${percent}%, #fff ${100-percent}%)`;
  }
}