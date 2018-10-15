import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { errorStateReducer, loaderStateReducer, LoaderEffects, ZtoFacade, ErrorEffects, LoggerEffects } from './zto-helpers';
import { AppFacade } from './app/facade';
import { AppEffects } from './app/effects';
import { appStateReducer } from './app/reducer';
import { ztohubStateReducer } from './ztohub/reducer';
import { ZtohubEffects } from './ztohub/effects';
import { ZtohubFacade } from './ztohub/facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      error: errorStateReducer,
      loader: loaderStateReducer,
      app: appStateReducer,
      ztohub: ztohubStateReducer,
    }),
    EffectsModule.forRoot([
      LoggerEffects,
      LoaderEffects,
      ErrorEffects,
      AppEffects,
      ZtohubEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: !environment.production,
    }),
  ],
  declarations: [],
  providers: [
    ZtoFacade,
    AppFacade,
    ZtohubFacade,
    LoggerEffects,
    LoaderEffects,
    ErrorEffects,
    AppEffects,
    ZtohubEffects
  ]
})
export class ZtoStoreModule { }
