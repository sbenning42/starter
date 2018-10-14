import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, map, catchError, first, tap, delay, flatMap, bufferCount } from 'rxjs/operators';
import { ofType, ErrorDocument, ofTypes, ofZto, ZtoAction } from '../zto-helpers';
import { AppActionTypes, AppCheckNetworkStatus, AppOnline, AppOffline, AppInitialize, AppInitialized } from './actions';
import { HttpClient } from '@angular/common/http';
import { of, zip } from 'rxjs';

@Injectable()
export class AppEffects {
  constructor(
    public actions$: Actions,
    public store: Store<any>,
    public http: HttpClient,
  ) {}
  @Effect()
  checkNetworkStatus = this.actions$.pipe(
    ofType(AppActionTypes.checkNetworkStatus),
    switchMap((action: AppCheckNetworkStatus) => this.http.get('https://postman-echo.com/get?foo1=bar1&foo2=bar2').pipe(
      map((result: any) => new AppOnline(
        action.header.correlation,
        action.header.sequence,
        action.header.loaderStart || false
      )),
      catchError((err: Error) => of(
        new AppOffline(
          action.header.correlation,
          action.header.sequence,
          action.header.loaderStart || false
        )
        // new ErrorDocument({error: {name: err.name, message: err.message, stack: err.stack}}, action.header.correlation),
      )),
      delay(2000),
    ))
  );

  @Effect()
  initialize = this.actions$.pipe(
    ofType(AppActionTypes.initialize),
    flatMap((action: AppInitialize) => [
      new AppCheckNetworkStatus(action.header.sequence, false),
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
      map((result: any) => new AppInitialized(action.header.correlation, action.header.sequence)),
      catchError((err: Error) => of(
        new ErrorDocument(
          {error: {name: err.name, message: err.message, stack: err.stack}},
          action.header.correlation,
        )
      ))
    ))
  );
}
