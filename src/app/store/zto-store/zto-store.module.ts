import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { errorStateReducer, loaderStateReducer, LoaderEffects, ZtoFacade, ErrorEffects } from './zto-helpers';
import { AppFacade } from './app/facade';
import { AppEffects } from './app/effects';
import { appStateReducer } from './app/reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      error: errorStateReducer,
      loader: loaderStateReducer,
      app: appStateReducer,
    }),
    EffectsModule.forRoot([
      LoaderEffects,
      ErrorEffects,
      AppEffects,
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
    LoaderEffects,
    ErrorEffects,
    AppEffects,
  ]
})
export class ZtoStoreModule { }
