import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './state';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AppName, AppVersion, AppLang, AppCheckNetworkStatus, AppInitialize, AppLsDocument } from './actions';

@Injectable()
export class AppFacade {

  app$: Observable<AppState>;
  name$: Observable<string>;
  version$: Observable<string>;
  lang$: Observable<string>;
  networkStatus$: Observable<boolean>;
  initialized$: Observable<boolean>;
  localStorageFetched$: Observable<boolean>;
  localStorage$: Observable<{[key: string]: string}>;

  constructor(public store: Store<any>) {
    this.app$ = this.store.pipe(
      select((state: {app: AppState}) => state.app),
    );
    this.name$ = this.app$.pipe(
      map((app: AppState) => app.name)
    );
    this.version$ = this.app$.pipe(
      map((app: AppState) => app.version)
    );
    this.lang$ = this.app$.pipe(
      map((app: AppState) => app.lang)
    );
    this.networkStatus$ = this.app$.pipe(
      map((app: AppState) => app.networkStatus)
    );
    this.localStorageFetched$ = this.app$.pipe(
      map((app: AppState) => app.localStorageFetched)
    );
    this.localStorage$ = this.app$.pipe(
      map((app: AppState) => app.localStorage)
    );
    this.initialized$ = this.app$.pipe(
      map((app: AppState) => app.initialized)
    );
  }

  name(name: string) {
    this.store.dispatch(new AppName({name}));
  }
  version(version: string) {
    this.store.dispatch(new AppVersion({version}));
  }
  lang(lang: string) {
    this.store.dispatch(new AppLang({lang}));
  }
  networkCheck() {
    this.store.dispatch(new AppCheckNetworkStatus({}, false));
  }
  initialize() {
    this.store.dispatch(new AppInitialize);
  }
  localStorage(partialStorage: {[key: string]: string}) {
    this.localStorage$.pipe(first()).subscribe((localStorageCache: {[key: string]: string}) => {
      this.store.dispatch(new AppLsDocument({storage: {...localStorageCache, ...partialStorage}}, {}));
    });
  }
}
