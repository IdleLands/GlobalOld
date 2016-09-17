import { provideRouter } from '@angular/router';

import { HomeComponent }  from './home/home.component';
import { MapsComponent } from './maps/maps.component';

export const routes = [
  { path: '',     component: HomeComponent },
  { path: 'maps', component: MapsComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];