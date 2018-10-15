import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ZtohubThemesFetch, ZtohubFiltersFetch } from './actions';
import { ZtohubState } from './state';
import { map } from 'rxjs/operators';

@Injectable()
export class ZtohubFacade {
  ztohub$: Observable<ZtohubState>;
  themesFetched$: Observable<boolean>;
  filtersFetched$: Observable<boolean>;
  themes$: Observable<any[]>;
  filters$: Observable<any[]>;
  constructor(public store: Store<any>) {
    this.ztohub$ = this.store.pipe(
      select((state: any) => state.ztohub)
    );
    this.themesFetched$ = this.ztohub$.pipe(
      map((state: ZtohubState) => state.themesFetched),
    );
    this.themes$ = this.ztohub$.pipe(
      map((state: ZtohubState) => state.themes),
    );
    this.filtersFetched$ = this.ztohub$.pipe(
      map((state: ZtohubState) => state.filtersFetched),
    );
    this.filters$ = this.ztohub$.pipe(
      map((state: ZtohubState) => state.filters),
    );
  }
  fetchThemes() {
    this.store.dispatch(new ZtohubThemesFetch({}, true));
  }
  fetchFilters() {
    this.store.dispatch(new ZtohubFiltersFetch({}, true));
  }
}
