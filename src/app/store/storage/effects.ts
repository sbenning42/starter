// EFFECTS TEMPLATE:

import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { filter, tap, switchMap, map, catchError } from 'rxjs/operators';
import {
  StorageActions,
  StorageActionTypes,
  StorageLoadRequest,
  StorageLoadReply,
  StorageSaveRequest,
  StorageSaveReply,
  StorageClearRequest,
  StorageClearReply,
  StorageDeleteRequest,
  StorageDeleteReply,
  StorageFirstLoadRequest,
  StorageFirstLoadReply
} from './actions';
import { StorageFacade } from './facade';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ofType, inTypes, propagateError } from '../zto-store/helpers';
import { ZtoError, mergeHeaders, loadingStopFactory, sequencedFactory, errorStartFactory } from '../zto-store/models';
import { of } from 'rxjs';

@Injectable()
export class StorageEffects {
  constructor(
    public actions$: Actions,
    public storageFacade: StorageFacade,
    public store: Store<any>,
    public storage: StorageService,
  ) {}
  // @Effect({dispatch: false})
  log = this.actions$.pipe(
    filter((action: Action) => action.type.includes('[Storage]')),
    tap((action: StorageActions) => console.log('StorageEffects@log: ', action)),
  );

  @Effect()
  firstLload = this.actions$.pipe(
    ofType(StorageActionTypes.FirstLoadRequest),
    switchMap((load: StorageFirstLoadRequest) => this.storage.getAll().pipe(
      map((storage: {[id: string]: string}) => new StorageFirstLoadReply({storage}, load)),
      propagateError(`${load.type} Error`, load, sequencedFactory(load.header)),
    ))
  );
  @Effect()
  load = this.actions$.pipe(
    ofType(StorageActionTypes.LoadRequest),
    switchMap((load: StorageLoadRequest) => this.storage.getAll().pipe(
      map((storage: {[id: string]: string}) => new StorageLoadReply({storage}, load)),
      propagateError(`${load.type} Error`, load),
    ))
  );

  @Effect()
  save = this.actions$.pipe(
    ofType(StorageActionTypes.SaveRequest),
    switchMap((save: StorageSaveRequest) => this.storage.setAll(save.payload.storage).pipe(
      map((storage: {[id: string]: string}) => new StorageSaveReply({storage}, save)),
      propagateError(`${save.type} Error`, save),
    ))
  );

  @Effect()
  delete = this.actions$.pipe(
    ofType(StorageActionTypes.DeleteRequest),
    switchMap((del: StorageDeleteRequest) => this.storage.removeItem(del.payload.key).pipe(
      map((key: string) => new StorageDeleteReply({key}, del)),
      propagateError(`${del.type} Error`, del),
    ))
  );

  @Effect()
  clear = this.actions$.pipe(
    ofType(StorageActionTypes.ClearRequest),
    switchMap((clear: StorageClearRequest) => this.storage.clear().pipe(
      map(() => new StorageClearReply({}, clear)),
      propagateError(`${clear.type} Error`, clear),
    ))
  );
}
