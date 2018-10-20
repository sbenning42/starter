import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AppFacade } from './facade';
import {
  AppActionTypes,
  AppReady,
  AppInitialize,
} from './actions';
import { ofType, inTypes } from '../zto-store/helpers';
import { map, first, delay, switchMap, tap, mergeMap, filter } from 'rxjs/operators';
import { ZtoFacade } from '../zto-store/facade';
import { ZtoHeader } from '../zto-store/models';
import { StorageFirstLoadRequest } from '../storage/actions';

@Injectable()
export class AppEffects {

  constructor(
    public actions$: Actions,
    public ztoSample: AppFacade,
    public zto: ZtoFacade,
  ) {}
  @Effect()
  ready = this.actions$.pipe(
    ofType(AppActionTypes.initialize),
    switchMap((initialize: AppInitialize) => this.zto.resolvedSequence(initialize).pipe(
      first(),
      map(() => new AppReady(initialize)),
    )),
  );
  @Effect()
  initialize = this.actions$.pipe(
    ofType(AppActionTypes.initialize),
    mergeMap((initialize: AppInitialize) => [
      new StorageFirstLoadRequest(initialize, 'AppEffects@Effect.initialize'),
    ]),
  );
}
