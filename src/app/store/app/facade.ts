import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from './state';
import { AppName, AppVersion, AppReady, AppLang, AppInitialize } from './actions';

@Injectable()
export class AppFacade {

  static initializedAptempt = 0;

  app$: Observable<AppState> = this.store.pipe(
    select((root: any) => root.app as AppState)
  );
  name$: Observable<string> = this.store.pipe(
    select((root: any) => (root.app as AppState).name)
  );
  version$: Observable<string> = this.store.pipe(
    select((root: any) => (root.app as AppState).version)
  );
  lang$: Observable<string> = this.store.pipe(
    select((root: any) => (root.app as AppState).lang)
  );
  ready$: Observable<boolean> = this.store.pipe(
    select((root: any) => (root.app as AppState).ready)
  );

  constructor(private store: Store<any>) {}

  name(name: string) {
    this.store.dispatch(new AppName({name}));
  }
  version(version: string) {
    this.store.dispatch(new AppVersion({version}));
  }
  lang(lang: string) {
    this.store.dispatch(new AppLang({lang}));
  }
  initialize() {
    /**Cannot initialize multiple times */
    if (AppFacade.initializedAptempt === 1) {
      return ;
    }
    AppFacade.initializedAptempt = 1;
    /**
     * AppInitialize is a ZtoSequence
     * (aka: async action who dispatch many others sync/async actions and who want to know when all those actions resolve
     *  (eg: with the use of ZtoFacade) see ./effects@AppEffects.ready for the actual implementation.
     * )
     * The parameter is the length of the sequence
     * (eg: 1 + the number of related ZtoSequenced action that must be dispatch for ZtoEffects to resolve the sequence)
     *
     * Here:
     *  3 = StorageFirstLoadRequest + StorageFirstLoadReply + 1; (cause AppInitialize is part of the sequence)
     */
    this.store.dispatch(new AppInitialize(3));
  }

}
