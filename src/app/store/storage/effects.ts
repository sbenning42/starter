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
import { ofType, inTypes, propagateError, reqRep } from '../zto-store/helpers';
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
    reqRep(
      (load: StorageFirstLoadRequest) => this.storage.getAll(),
      (storage: {[id: string]: string}, load: StorageFirstLoadRequest) => new StorageFirstLoadReply({storage}, load),
      (load: StorageFirstLoadRequest) => sequencedFactory(load.header),
    ),
  );
  @Effect()
  load = this.actions$.pipe(
    ofType(StorageActionTypes.LoadRequest),
    reqRep(
      (load: StorageLoadRequest) => this.storage.getAll(),
      (storage: {[id: string]: string}, load: StorageLoadRequest) => new StorageLoadReply({storage}, load),
    ),
  );

  @Effect()
  save = this.actions$.pipe(
    ofType(StorageActionTypes.SaveRequest),
    reqRep(
      (save: StorageSaveRequest) => this.storage.setAll(save.payload.storage),
      (storage: {[id: string]: string}, save: StorageSaveRequest) => new StorageSaveReply({storage}, save),
    ),
  );

  @Effect()
  delete = this.actions$.pipe(
    ofType(StorageActionTypes.DeleteRequest),
    reqRep(
      (del: StorageDeleteRequest) => this.storage.removeItem(del.payload.key),
      (key: string, del: StorageDeleteRequest) => new StorageDeleteReply({key}, del),
    ),
  );

  @Effect()
  clear = this.actions$.pipe(
    ofType(StorageActionTypes.ClearRequest),
    reqRep(
      (clear: StorageDeleteRequest) => this.storage.clear(),
      (resp: any, clear: StorageDeleteRequest) => new StorageClearReply({}, clear),
    ),
  );
}
