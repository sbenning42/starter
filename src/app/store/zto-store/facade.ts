import { Injectable } from '@angular/core';
import { ZtoHeader } from './models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ZtoState } from './state';

@Injectable()
export class ZtoFacade {
  zto$: Observable<ZtoState> = this.store.pipe(
    select((root: any) => root.zto as ZtoState),
  );
  /**
   * I could simply map this.zto$ to it's subparts but be aware:
   *  If one want to refactor it this way, he loose the memoization of the selector (eg: @ngrx/store:select)
   */
  pendingCorrelations$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingCorrelations),
  );
  pendingSequences$: Observable<{[id: string]: ZtoHeader[]}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingSequences),
  );
  pendingLoadings$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingLoadings),
  );
  pendingErrors$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingErrors),
  );
  constructor(public store: Store<any>) {}
}
