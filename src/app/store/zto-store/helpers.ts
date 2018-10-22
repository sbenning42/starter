import { MonoTypeOperatorFunction, Observable, OperatorFunction, of, merge, ObservableInput, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { filter, map, catchError, mergeMap, delay, switchMap, first, retry } from 'rxjs/operators';
import { ZtoAction, ZtoError, ZtoResolveError, ZtoHeader, ZtoRequest, ZtoReply } from './models';

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
export const handleError = propagateError;
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
export function reqRep(
  sideEffect: (req: ZtoRequest) => Observable<any>,
  success: (resp: any, req: ZtoRequest) => ZtoReply,
  errorHeader: (req: ZtoRequest) => ZtoHeader = () => ({}),
  concurent: number = 1,
  extra: {
    retryTime?: number,
    withErrorHandling?: boolean,
    delayTime?: number,
    throwErr?: Error,
  } = {},
): OperatorFunction<ZtoRequest, ZtoReply> {
  const noop = map((r: any) => r);
  const flateningStrategy = concurent > 1 ? (flatFn) => mergeMap(flatFn, concurent > 25 ? 25 : concurent) : switchMap;
  return (actions$: Observable<ZtoAction>) => actions$.pipe(
    flateningStrategy((request: ZtoRequest) => sideEffect(request).pipe(first(),
      extra.delayTime > -1 ? delay(extra.delayTime) : noop,
      extra.throwErr !== undefined ? switchMap(() => throwError(extra.throwErr)) : noop,
      extra.retryTime > 0 ? retry(extra.retryTime) : noop,
      map((response: any) => success(response, request)),
      extra.withErrorHandling !== false ? handleError(`${request.type} Error`, request, errorHeader(request)) : noop,
    )),
  );
}

