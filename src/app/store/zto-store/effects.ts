import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { filter, map, first, mergeMap } from 'rxjs/operators';
import { Action, Store, select } from '@ngrx/store';
import { ZtoAction, ZtoHeader, mergeHeaders, timestampFactory } from './models';
import { Observable } from 'rxjs';
import { ZtoState } from './state';
import {
  AddCorrelation,
  ResolveCorrelation,
  AddSequence,
  ResolveSequence,
  AddLoading,
  ResolveLoading,
  AddError,
  ResolveError
} from './actions';
import { ZtoFacade } from './facade';
import { isCorrelated, isSequenced, isErrorRelated, isLoading } from './helpers';

@Injectable()
export class ZtoEffects {

  pendingCorrelations$ = this.zto.pendingCorrelations$.pipe(first());
  pendingSequences$ = this.zto.pendingSequences$.pipe(first());
  pendingLoadings$ = this.zto.pendingLoadings$.pipe(first());
  pendingErrors$ = this.zto.pendingErrors$.pipe(first());

  constructor(public actions: Actions, public zto: ZtoFacade) {}

  @Effect()
  trackCorrelations = this.actions.pipe(
    isCorrelated(),
    mergeMap((action: ZtoAction) => this.pendingCorrelations$.pipe(
      map((pendingCorrelations: {[id: string]: ZtoHeader}) => correlationMap(pendingCorrelations, action.header))
    ))
  );
  @Effect()
  trackSequences = this.actions.pipe(
    isSequenced(),
    mergeMap((action: ZtoAction) => this.pendingSequences$.pipe(
      map((pendingSequences: {[id: string]: ZtoHeader[]}) => sequenceMap(pendingSequences, action.header))
    ))
  );
  @Effect()
  trackLoadings = this.actions.pipe(
    isLoading(),
    mergeMap((action: ZtoAction) => this.pendingLoadings$.pipe(
      map((pendingLoadings: {[id: string]: ZtoHeader}) => loadingMap(pendingLoadings, action.header))
    ))
  );
  @Effect()
  trackErrors = this.actions.pipe(
    isErrorRelated(),
    mergeMap((action: ZtoAction) => this.pendingErrors$.pipe(
      map((pendingErrors: {[id: string]: ZtoHeader}) => errorMap(pendingErrors, action.header))
    ))
  );
}
function correlationMap(pendingCorrelations: {[id: string]: ZtoHeader}, header: ZtoHeader) {
  return cannotResolveCorrelation(pendingCorrelations, header)
    ? new AddCorrelation(header)
    : new ResolveCorrelation(mergeHeaders(header, timestampFactory()));
}
function sequenceMap(pendingSequences: {[id: string]: ZtoHeader[]}, header: ZtoHeader) {
  return cannotResolveSequence(pendingSequences, header)
    ? new AddSequence(header)
    : new ResolveSequence(mergeHeaders(header, timestampFactory()));
}
function loadingMap(pendingLoadings: {[id: string]: ZtoHeader}, header: ZtoHeader) {
  return cannotResolveLoading(pendingLoadings, header)
    ? new AddLoading(header)
    : new ResolveLoading(mergeHeaders(header, timestampFactory()));
}
function errorMap(pendingErrors: {[id: string]: ZtoHeader}, header: ZtoHeader) {
  return cannotResolveError(pendingErrors, header)
    ? new AddError(header)
    : new ResolveError(mergeHeaders(header, timestampFactory()));
}
function cannotResolveCorrelation(pendingCorrelations: {[id: string]: ZtoHeader}, header: ZtoHeader): boolean {
  return !pendingCorrelations[header.correlationId];
}
/**
 * I cannot resolve a sequence if and only if:
 *  - I don't know this sequence but the header define a valid sequenceLength (eg: > 1)
 *  - I know this sequence but it's current length is less than the one define in it's first header
 *    (aka: the one who started the sequence)
*/
function cannotResolveSequence(pendingSequences: {[id: string]: ZtoHeader[]}, header: ZtoHeader): boolean {
  const pendingSequence = pendingSequences[header.sequenceId];
  return (!pendingSequence && header.sequenceLength > 1)
    || (!!pendingSequence && pendingSequence.length < pendingSequence[0].sequenceLength - 1);
}
function cannotResolveLoading(pendingLoadings: {[id: string]: ZtoHeader}, header: ZtoHeader): boolean {
  return !pendingLoadings[header.loadingId];
}
function cannotResolveError(pendingErrors: {[id: string]: ZtoHeader}, header: ZtoHeader): boolean {
  return !pendingErrors[header.errorId];
}
