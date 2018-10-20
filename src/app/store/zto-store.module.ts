import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';
import { ztoStateReducer } from './zto-store/reducer';
import { ZtoEffects } from './zto-store/effects';
import { ZtoFacade } from './zto-store/facade';
import { ztoSampleStateReducer } from './zto-sample/reducer';
import { ZtoSampleEffects } from './zto-sample/effects';
import { ZtoSampleFacade } from './zto-sample/facade';
import { appStateReducer } from './app/reducer';
import { AppEffects } from './app/effects';
import { AppFacade } from './app/facade';
import { storageStateReducer } from './storage/reducer';
import { StorageEffects } from './storage/effects';
import { StorageFacade } from './storage/facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({
      zto: ztoStateReducer,
      ztoSample: ztoSampleStateReducer,
      app: appStateReducer,
      storage: storageStateReducer,
    }),
    EffectsModule.forRoot([
      ZtoEffects,
      ZtoSampleEffects,
      AppEffects,
      StorageEffects,
    ]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: !environment.production,
    }),
  ],
  declarations: [
  ],
  providers: [
    ZtoEffects,
    ZtoFacade,
    ZtoSampleEffects,
    ZtoSampleFacade,
    AppEffects,
    AppFacade,
    StorageEffects,
    StorageFacade,
  ],
  exports: [
  ]
})
export class ZtoStoreModule { }
