import { provideRouter } from '@angular/router';

import { PlayersComponent }  from './players/players.component.js';
import { PlayerComponent } from './player/player.component';
import { PetsComponent } from './pets/pets.component';
import { PetComponent } from './pet/pet.component';
import { MapsComponent } from './maps/maps.component';

export const routes = [
  { path: '',                 redirectTo: 'players', pathMatch: 'full' },
  { path: 'players',          component: PlayersComponent },
  { path: 'players/:name',    component: PlayerComponent },
  { path: 'pets',             component: PetsComponent },
  { path: 'pets/:name',       component: PetComponent },
  { path: 'maps',             component: MapsComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];