import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { tap, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AppEffects {
  constructor(
    public store: Store<any>,
    public actions$: Actions,
    /**
     * Load App depedencies here
     */
  ) {}

  /**
   * Log all dispatched actions
   */
  @Effect({dispatch: false})
  logActions$ = this.actions$.pipe(
    filter(() => environment.logActions),
    tap((action: Action) => console.log('Action: ', action)),
  );

  /**
   * Log all store changes
   */
  @Effect({dispatch: false})
  logStore$ = this.store.pipe(
    filter(() => environment.logStores),
    tap((store: Store<any>) => console.log('Store: ', store))
  );

}
