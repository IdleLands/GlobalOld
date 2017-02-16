
import 'reflect-metadata';
import 'zone.js/dist/zone';

import { DomSanitizationService } from '@angular/platform-browser';
import { CustomDomSanitizer } from './services/domsanitizer.override';

// require the favicons
require.context('../favicon', true, /^\.\//);

import 'bootstrap/dist/css/bootstrap.css';
import 'chart.js';

import { HTTP_PROVIDERS } from '@angular/http';
import { provide, PLATFORM_DIRECTIVES, enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { GameIconsDirective } from 'ng2-gameicons';
import { FontAwesomeDirective } from 'ng2-fontawesome';
import { StatComponent } from './directives/stat';

import { App } from './components/app.component';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

import { TOOLTIP_DIRECTIVES } from 'ng2-bootstrap/components/tooltip';
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { APP_ROUTER_PROVIDERS } from './components/app.routes';

if(window.location.hostname !== 'localhost') enableProdMode();

bootstrap(App, [
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  { provide: DomSanitizationService, useClass: CustomDomSanitizer },
  // { provide: LocationStrategy, useClass: HashLocationStrategy },
  provide(PLATFORM_DIRECTIVES, { useValue: CHART_DIRECTIVES, multi: true }),
  provide(PLATFORM_DIRECTIVES, { useValue: TOOLTIP_DIRECTIVES, multi: true }),
  provide(PLATFORM_DIRECTIVES, { useValue: FontAwesomeDirective, multi: true }),
  provide(PLATFORM_DIRECTIVES, { useValue: GameIconsDirective, multi: true }),
  provide(PLATFORM_DIRECTIVES, { useValue: StatComponent, multi: true })
]);