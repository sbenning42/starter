import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from './state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppName, AppVersion, AppLang, AppCheckNetworkStatus, AppInitialize } from './actions';

@Injectable()
export class AppFacade {

  app$: Observable<AppState>;
  name$: Observable<string>;
  version$: Observable<string>;
  lang$: Observable<string>;
  networkStatus$: Observable<boolean>;
  initialized$: Observable<boolean>;

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
    this.store.dispatch(new AppCheckNetworkStatus);
  }
  initialize() {
    this.store.dispatch(new AppInitialize);
  }
}
