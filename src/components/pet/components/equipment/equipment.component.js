
import { Component } from '@angular/core';
import template from './equipment.html';

import { ItemComponent } from '../../../_shared/item/item.component';

@Component({
  selector: 'equipment',
  directives: [ItemComponent],
  inputs: ['player'],
  template
})
export class EquipmentComponent {
}