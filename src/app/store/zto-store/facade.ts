import { Injectable } from '@angular/core';
import { ZtoHeader, ZtoAction } from './models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ZtoState } from './state';
import { filter, first, map } from 'rxjs/operators';

@Injectable()
export class ZtoFacade {
  zto$: Observable<ZtoState> = this.store.pipe(
    select((root: any) => root.zto as ZtoState),
  );
  /**
   * I could simply map this.zto$ to it's subparts but be aware:
   *  If one want to refactor it this way, he loose the memoization of the selector (eg: @ngrx/store:select)
   */
  resolvedCorrelations$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedCorrelation),
  );
  resolvedSequences$: Observable<{[id: string]: {headers: ZtoHeader[], timestamp: number}}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedSequences),
  );
  resolvedLoadings$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedLoadings),
  );
  resolvedErrors$: Observable<{[id: string]: ZtoHeader}> = this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedErrors),
  );

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

  resolvedCorrelation: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedCorrelation[action.header.correlationId]),
    filter((header: ZtoHeader) => !!header),
    first()
  )
  resolvedSequence: (action: ZtoAction) => Observable<ZtoHeader[]> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedSequences[action.header.sequenceId]),
    filter((sequence: any) => !!sequence),
    map((sequence: any) => sequence.headers),
    first()
  )
  resolvedLoading: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedLoadings[action.header.loadingId]),
    filter((header: ZtoHeader) => !!header),
    first()
  )
  resolvedError: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).resolvedErrors[action.header.errorId]),
    filter((header: ZtoHeader) => !!header),
    first()
  )

  pendingCorrelation: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingCorrelations[action.header.correlationId]),
    filter((header: ZtoHeader) => !!header),
  )
  pendingSequence: (action: ZtoAction) => Observable<ZtoHeader[]> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingSequences[action.header.sequenceId]),
    filter((headers: ZtoHeader[]) => !!headers),
  )
  pendingLoading: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingLoadings[action.header.loadingId]),
    filter((header: ZtoHeader) => !!header),
  )
  pendingError: (action: ZtoAction) => Observable<ZtoHeader> = (action: ZtoAction) => this.store.pipe(
    select((root: any) => (root.zto as ZtoState).pendingErrors[action.header.errorId]),
    filter((header: ZtoHeader) => !!header),
  )

  constructor(public store: Store<any>) {}
}
