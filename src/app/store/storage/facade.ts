
// FACADE TEMPLATE:

import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StorageState } from './state';
import { Observable } from 'rxjs';
import { StorageLoadRequest, StorageSaveRequest, StorageClearRequest, StorageDeleteRequest } from './actions';

@Injectable()
export class StorageFacade {

  storageState$: Observable<StorageState> = this.store.pipe(
    select((root: any) => root.storage as StorageState)
  );
  storage$: Observable<{[id: string]: string}> = this.store.pipe(
    select((root: any) => (root.storage as StorageState).storage)
  );
  loaded$: Observable<boolean> = this.store.pipe(
    select((root: any) => (root.storage as StorageState).loaded)
  );

  constructor(private store: Store<any>) {}

  load(source: string) {
    this.store.dispatch(new StorageLoadRequest(source));
  }
  save(storage: {[id: string]: string}) {
    this.store.dispatch(new StorageSaveRequest({storage}));
  }
  delete(key: string) {
    this.store.dispatch(new StorageDeleteRequest({key}));
  }
  clear() {
    this.store.dispatch(new StorageClearRequest);
  }
}
