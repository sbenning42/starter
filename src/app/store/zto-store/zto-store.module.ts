import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../../environments/environment';
import { appReducer } from './app/app.reducer';
import { AppEffects } from './app/app.effects';
import { AppFacade } from './app/app.facade';
import { loaderReducer } from './loader/loader.reducer';
import { errorReducer } from './error/error.reducer';
import { LoaderEffects } from './loader/loader.effects';
import { LoaderFacade } from './loader/loader.facade';
import { ErrorEffects } from './error/error.effects';
import { ErrorFacade } from './error/error.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      app: appReducer,
      loader: loaderReducer,
      error: errorReducer,
    }),
    EffectsModule.forRoot([
      AppEffects,
      LoaderEffects,
      ErrorEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: !environment.production,
    }),
  ],
  declarations: [],
  providers: [
    AppEffects,
    LoaderEffects,
    ErrorEffects,
    AppFacade,
    LoaderFacade,
    ErrorFacade,
  ]
})
export class ZtoStoreModule { }
