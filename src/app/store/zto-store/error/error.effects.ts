import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { tap, filter, map, flatMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorError, ErrorAdd } from './error.actions';

@Injectable()
export class ErrorEffects {
  constructor(
    public store: Store<any>,
    public actions$: Actions,
    /**
     * Load Error depedencies here
     */
  ) {}

  /**
   *
   */
  @Effect({dispatch: false})
  handleError$ = this.actions$.pipe(
    filter((action: Action) => /*predicate here*/false),
    flatMap((action: Action) => [
      new ErrorError({error: {name: '', message: '', source: ''}}),
      new ErrorAdd({error: {name: '', message: '', source: ''}}),
    ]),
  );
}
