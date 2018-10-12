import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { tap, filter, mergeMap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { LoaderActionTypes, LoaderStart, LoaderStop } from './loader.actions';

@Injectable()
export class LoaderEffects {
  constructor(
    public store: Store<any>,
    public actions$: Actions,
    /**
     * Load Loader depedencies here
     */
  ) {}

  /**
   *
   */
  @Effect({dispatch: false})
  start$ = this.actions$.pipe(
    filter(() => environment.withLoader),
    filter((action: Action) => /*predicate here*/false),
    map((action: Action) => new LoaderStart({content: '', source: action.type})),
  );

  /**
   *
   */
  @Effect({dispatch: false})
  stop$ = this.actions$.pipe(
    filter(() => environment.withLoader),
    filter((action: Action) => /*predicate here*/false),
    map((action: Action) => new LoaderStop({source: action.type})),
  );

}
