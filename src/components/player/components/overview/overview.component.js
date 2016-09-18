
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
}