import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, map, catchError, first, tap, delay, flatMap, bufferCount } from 'rxjs/operators';
import { ofType, ErrorDocument, ofTypes, ofZto, ZtoAction } from '../zto-helpers';
import {
  AppActionTypes,
  AppCheckNetworkStatus,
  AppOnline,
  AppOffline,
  AppInitialize,
  AppInitialized,
  AppLsFetch,
  AppLsFetched,
  AppLsSave,
  AppLsSaved,
  AppLsDocument
} from './actions';
import { HttpClient } from '@angular/common/http';
import { of, zip } from 'rxjs';
import { AppFacade } from './facade';
import { StorageService } from '../../../services/storage/storage.service';

@Injectable()
export class AppEffects {
  constructor(
    public actions$: Actions,
    public store: Store<any>,
    public app: AppFacade,
    public http: HttpClient,
    public storage: StorageService,
  ) {}
  @Effect()
  checkNetworkStatus = this.actions$.pipe(
    ofType(AppActionTypes.checkNetworkStatus),
    switchMap((action: AppCheckNetworkStatus) => this.http.get('https://postman-echo.com/get?foo1=bar1&foo2=bar2').pipe(
      map((result: any) => new AppOnline(action.header, action.header.loaderStart || false)),
      catchError((err: Error) => of(
        new AppOffline(action.header, action.header.loaderStart || false)
      )),
      // delay(2000),
    ))
  );

  @Effect()
  localStorageFetch = this.actions$.pipe(
    ofType(AppActionTypes.localStorageFetch),
    switchMap((action: AppLsFetch) => this.storage.getAll().pipe(
      // delay(5000),
      flatMap((storage: {[key: string]: string}) => [
        new AppLsFetched({storage}, action.header),
        new AppLsDocument({storage}, action.header)
      ]),
    ))
  );

  @Effect()
  localStorageSaveWhenChange = this.actions$.pipe(
    ofType(AppActionTypes.localStorageDocument),
    map((action: AppLsDocument) => new AppLsSave({storage: action.payload.storage})),
  );

  @Effect()
  localStorageSave = this.actions$.pipe(
    ofType(AppActionTypes.localStorageSave),
    switchMap((action: AppLsSave) => this.storage.setAll(action.payload.storage).pipe(
      map((storage: {[key: string]: string}) => new AppLsSaved({storage}, action.header))
      // delay(2000),
    ))
  );

  @Effect()
  initialize = this.actions$.pipe(
    ofType(AppActionTypes.initialize),
    flatMap((action: AppInitialize) => [
      new AppCheckNetworkStatus(action.header, false),
      new AppLsFetch(action.header)
    ])
  );
  @Effect()
  initializeSequenceTerminated = this.actions$.pipe(
    ofType(AppActionTypes.initialize),
    switchMap((action: AppInitialize) => this.actions$.pipe(
      ofZto(),
      filter((innerAction: ZtoAction<any>) => !!innerAction.header.sequence),
      filter((innerAction: ZtoAction<any>) => innerAction.header.sequence.sequenceId === action.header.sequence.sequenceId),
      bufferCount(action.header.sequence.sequenceLength - 1),
      first(),
      map((result: any) => new AppInitialized(action.header)),
      catchError((err: Error) => of(
        new ErrorDocument({error: {name: err.name, message: err.message, stack: err.stack}}, action.header.correlation)
      ))
    ))
  );

  compareStorage(s1: {[key: string]: string}, s2: {[key: string]: string}): boolean {
    return Object.entries(s1).every(([key, value]) => s2[key] === value);
  }
}
