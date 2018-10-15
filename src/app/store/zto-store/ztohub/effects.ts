import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ApiService } from '../../../services/api/api.service';
import {
  ZtohubActionTypes,
  ZtohubThemesFetch,
  ZtohubThemesFetched,
  ZtohubThemes,
  ZtohubFiltersFetch,
  ZtohubFiltersFetched,
  ZtohubFilters
} from './actions';
import { switchMap, flatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ErrorDocument } from '../zto-helpers';

@Injectable()
export class ZtohubEffects {
  constructor(
    public actions$: Actions,
    public store: Store<any>,
    public api: ApiService,
  ) {}
  @Effect()
  fetchThemes = this.actions$.pipe(
    ofType(ZtohubActionTypes.themesFetch),
    switchMap((action: ZtohubThemesFetch) => this.api.hubThemes().pipe(
      flatMap((themes: any[]) => [
        new ZtohubThemes({themes}, action.header),
        new ZtohubThemesFetched({themes}, action.header, action.header.loaderStart || false),
      ]),
      catchError((err: Error) => of(new ErrorDocument({error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }}, action.header.correlation)))
    ))
  );
  @Effect()
  fetchFilters = this.actions$.pipe(
    ofType(ZtohubActionTypes.themesFetch),
    switchMap((action: ZtohubFiltersFetch) => this.api.hubFilters().pipe(
      flatMap((filters: any[]) => [
        new ZtohubFilters({filters}, action.header),
        new ZtohubFiltersFetched({filters}, action.header, action.header.loaderStart || false),
      ]),
      catchError((err: Error) => of(new ErrorDocument({error: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }}, action.header.correlation)))
    ))
  );
}
