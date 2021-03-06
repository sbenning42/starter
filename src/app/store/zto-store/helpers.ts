import { MonoTypeOperatorFunction, Observable, OperatorFunction, of, merge, ObservableInput } from 'rxjs';
import { Action } from '@ngrx/store';
import { filter, map, catchError, mergeMap, delay } from 'rxjs/operators';
import { ZtoAction, ZtoError, ZtoResolveError, ZtoHeader } from './models';

export function getUid() {
  // tslint:disable:no-bitwise
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
  // tslint:enable:no-bitwise
}

export function ofType(type: string): MonoTypeOperatorFunction<Action> {
  return filter((action: Action) => action.type === type);
}
export function inTypes(types: string[]): MonoTypeOperatorFunction<Action> {
  return filter((action: Action) => types.includes(action.type));
}
export function ofZto(): MonoTypeOperatorFunction<Action> {
  return filter((action: Action) => !!(action as ZtoAction).header);
}
export function asZto(): OperatorFunction<Action, ZtoAction> {
  return (actions$: Observable<Action>) => actions$.pipe(
    ofZto(),
    map((action: Action) => action as ZtoAction),
  );
}
export function propagateError(
  type: string,
  action: ZtoAction,
  header: ZtoHeader = {},
): MonoTypeOperatorFunction<ZtoAction> {
  return (actions$: Observable<ZtoAction>) => actions$.pipe(
    catchError((error: Error) => of(new ZtoError(type, action, `${error.name}%${error.message}`, header))),
  );
}
export function isCorrelated(): OperatorFunction<Action, ZtoAction> {
  return (actions$: Observable<Action>) => actions$.pipe(
    asZto(),
    filter((action: ZtoAction) => !!action.header.correlationId),
  );
}
export function isSequenced(): OperatorFunction<Action, ZtoAction> {
  return (actions$: Observable<Action>) => actions$.pipe(
    asZto(),
    filter((action: ZtoAction) => !!action.header.sequenceId),
  );
}
export function isLoading(): OperatorFunction<Action, ZtoAction> {
  return (actions$: Observable<Action>) => actions$.pipe(
    asZto(),
    filter((action: ZtoAction) => !!action.header.loadingId),
  );
}
export function isErrorRelated(): OperatorFunction<Action, ZtoAction> {
  return (actions$: Observable<Action>) => actions$.pipe(
    asZto(),
    filter((action: ZtoAction) => !!action.header.errorId),
  );
}

