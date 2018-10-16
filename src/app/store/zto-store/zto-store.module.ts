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
import { SampleEffects, sampleStateReducer, SampleFacade, SampleFacadeComponent, SampleService } from '../zto-redux-helpers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      error: errorStateReducer,
      loader: loaderStateReducer,
      app: appStateReducer,
      sample: sampleStateReducer,
    }),
    EffectsModule.forRoot([
      LoggerEffects,
      LoaderEffects,
      ErrorEffects,
      AppEffects,
      SampleEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: !environment.production,
    }),
  ],
  declarations: [
    SampleFacadeComponent
  ],
  providers: [
    SampleService,
    ZtoFacade,
    AppFacade,
    LoggerEffects,
    LoaderEffects,
    ErrorEffects,
    AppEffects,
    SampleEffects,
    SampleFacade,
  ],
  exports: [
    SampleFacadeComponent
  ]
})
export class ZtoStoreModule { }
