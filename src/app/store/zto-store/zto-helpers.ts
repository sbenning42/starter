import { Action, Store, select } from '@ngrx/store';
import { Uuid } from '../../helpers/zto';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { OperatorFunction, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { filter, map, delay, takeUntil, first, switchMap, mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ErrorPayload {
  name: string;
  message: string;
  stack?: string;
}
export interface UniqueHeader {
  uuid?: string;
}
export interface TrackedHeader {
  timestamp?: number;
}
export interface CorrelationHeader {
  correlationId?: string;
  correlationType?: string;
}
export interface SequenceHeader {
  sequenceId?: string;
  sequenceIndex?: number;
  sequenceLength?: number;
}
export interface AsyncHeader {
  loaderStart?: boolean;
  loaderContent?: string;
}
export interface ErrorHeader {
  errorStart?: boolean;
  errorPayload?: ErrorPayload;
}
export interface ZtoHeader {
  [key: string]: any;
}
export interface ZtoAction<P> extends Action {
  header: ZtoHeader;
  payload?: P;
}

export abstract class ZtoEmptyAction implements ZtoAction<undefined> {
  abstract type: string;
  constructor(public header: ZtoHeader) {}
}

export function uniqueHeader(header: ZtoHeader = {}): ZtoHeader {
  return {
    uuid: Uuid(),
    ...header,
  };
}
export function correlationHeader(correlation: CorrelationHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    correlation: {
      correlationId: Uuid(),
      correlationType: correlation.correlationType,
    },
    ...header,
  };
}
export function correlatedHeader(correlation: CorrelationHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    correlation: {
      correlationId: correlation.correlationId,
      correlationType: correlation.correlationType,
    },
    ...header,
  };
}
export function sequenceHeader(sequence: SequenceHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    sequence: {
      sequenceId: Uuid(),
      sequenceIndex: sequence.sequenceIndex,
      sequenceLength: sequence.sequenceLength,
    },
    ...header,
  };
}
export function sequencedHeader(sequence: SequenceHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    sequence: {
      sequenceId: sequence.sequenceId,
      sequenceIndex: sequence.sequenceIndex,
      sequenceLength: sequence.sequenceLength,
    },
    ...header,
  };
}
export function startAsyncHeader(async: AsyncHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    loaderStart: true,
    loaderContent: async.loaderContent,
    ...header,
  };
}
export function stopAsyncHeader(header: ZtoHeader = {}): ZtoHeader {
  return {
    loaderStart: false,
    ...header,
  };
}
export function startErrorHeader(error: ErrorHeader = {}, header: ZtoHeader = {}): ZtoHeader {
  return {
    errorStart: true,
    errorPayload: error.errorPayload,
    ...header,
  };
}
export function stopErrorHeader(header: ZtoHeader = {}): ZtoHeader {
  return {
    errorStart: false,
    ...header,
  };
}
export function trackedHeader(header: ZtoHeader = {}): ZtoHeader {
  return {
    timestamp: Date.now(),
    ...header,
  };
}

export function mergeHeaders(...headers: ZtoHeader[]): ZtoHeader {
  let header = {};
  headers.forEach(h => header = {...header, ...h});
  return header;
}

export class ErrorDocument implements ZtoAction<{error: ErrorPayload}> {
  type = '[zto] error document';
  header: ZtoHeader;
  constructor(public payload: {error: ErrorPayload}, correlation?: CorrelationHeader) {
    const errorHeader: ErrorHeader = {errorPayload: payload.error};
    this.header = startErrorHeader(errorHeader, correlatedHeader(correlation, stopAsyncHeader(uniqueHeader())));
  }
}
export class ErrorHandle implements ZtoAction<ErrorPayload> {
  type = '[zto] error handle';
  header: ZtoHeader;
  constructor(correlation?: CorrelationHeader) {
    this.header = stopErrorHeader(correlatedHeader(correlation));
  }
}
export class LoaderStartCommand implements ZtoAction<{content: string}> {
  type = '[loader] start command';
  header: ZtoHeader;
  constructor(public payload: {content: string}, correlation?: CorrelationHeader) {
    this.header = correlatedHeader(correlation);
  }
}
export class LoaderStopCommand implements ZtoAction<{content: string}> {
  type = '[loader] stop command';
  header: ZtoHeader;
  constructor(correlation?: CorrelationHeader) {
    this.header = correlatedHeader(correlation);
  }
}

export interface ErrorState {
  lastError: ErrorPayload;
  errorHandled: boolean;
}
export const initialErrorState: ErrorState = {
  lastError: undefined,
  errorHandled: undefined,
};
export interface LoaderState {
  loading: boolean;
  type: string;
  content: string;
}
export const initialLoaderState: LoaderState = {
  loading: false,
  type: undefined,
  content: undefined,
};

export function errorStateReducer(state: ErrorState = initialErrorState, action: Action): ErrorState {
  switch (action.type) {
    case '[zto] error document': {
      const errorAction = action as ErrorDocument;
      return {
        ...state,
        lastError: errorAction.payload.error,
        errorHandled: false,
      };
    }
    case '[zto] error handle': {
      const handleAction = action as ErrorHandle;
      return {
        ...state,
        errorHandled: true,
      };
    }
    default: {
      return state;
    }
  }
}

export function loaderStateReducer(state: LoaderState = initialLoaderState, action: Action): LoaderState {
  switch (action.type) {
    case '[loader] start command': {
      const startAction = action as LoaderStartCommand;
      const correlation = startAction.header.correlation || {};
      return {
        ...state,
        loading: true,
        type: correlation.correlationType,
        content: startAction.payload.content,
      };
    }
    case '[loader] stop command': {
      return {
        ...state,
        loading: false,
        type: undefined,
        content: undefined,
      };
    }
    default: {
      return state;
    }
  }
}

export function ofType(type: string): MonoTypeOperatorFunction<Action> {
  return (actions$: Actions) => actions$.pipe(
    filter((action: Action) => action.type === type),
  );
}

export function ofTypes(types: string[]): MonoTypeOperatorFunction<Action> {
  return (actions$: Actions) => actions$.pipe(
    filter((action: Action) => types.includes(action.type)),
  );
}

export function ofZto(): OperatorFunction<Action, ZtoAction<any>> {
  return (actions$: Actions) => actions$.pipe(
    filter((action: Action) => !!(<ZtoAction<any>>action).header),
    map((action: Action) => <ZtoAction<any>>action),
  );
}

@Injectable()
export class ZtoFacade {
  loader$: Observable<LoaderState>;
  loading$: Observable<boolean>;
  content$: Observable<string>;
  type$: Observable<string>;
  error$: Observable<ErrorState>;
  lastError$: Observable<ErrorPayload>;
  errorHandled$: Observable<boolean>;
  constructor(public store: Store<any>) {
    this.loader$ = this.store.pipe(
      select((state: {loader: LoaderState}) => state.loader),
    );
    this.loading$ = this.loader$.pipe(
      map((loader: LoaderState) => loader.loading),
    );
    this.content$ = this.loader$.pipe(
      map((loader: LoaderState) => loader.content),
    );
    this.type$ = this.loader$.pipe(
      map((loader: LoaderState) => loader.type),
    );
    this.error$ = this.store.pipe(
      select((state: {error: ErrorState}) => state.error),
    );
    this.lastError$ = this.error$.pipe(
      map((error: ErrorState) => error.lastError),
    );
    this.errorHandled$ = this.error$.pipe(
      map((error: ErrorState) => error.errorHandled),
    );
  }
  startLoaderBypassActionHeader(header: {type: string, content: string}) {
    this.store.dispatch(new LoaderStartCommand(
      {content: header.content},
      {correlationType: header.type, correlationId: 'ZtoFacade.startLoaderBypassActionHeader'},
    ));
  }
  stopLoaderBypassActionHeader(header: {type: string}) {
    this.store.dispatch(new LoaderStopCommand(
      {correlationType: header.type, correlationId: 'ZtoFacade.stopLoaderBypassActionHeader'},
    ));
  }
  startError(error: Error, correlation: CorrelationHeader) {
    this.store.dispatch(new ErrorDocument({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }, correlation));
  }
  stopError(correlation: CorrelationHeader) {
    this.store.dispatch(new ErrorHandle(correlation));
  }

}
@Injectable()
export class ErrorEffects {
  constructor(public actions$: Actions, public zto: ZtoFacade) {}
  @Effect()
  unhandledErrorTimeout = this.actions$.pipe(
    ofType('[zto] error document'),
    mergeMap((action: ErrorDocument) => of(true).pipe(
      delay(15000),
      map(() => new ErrorHandle(action.header.correlation)),
      takeUntil(this.zto.errorHandled$.pipe(
        filter((status: boolean) => status === true),
      )),
    ))
  );
}

@Injectable()
export class LoaderEffects {
  constructor(public actions$: Actions) {}
  @Effect()
  start = this.actions$.pipe(
    filter(() => environment.withLoader),
    ofZto(),
    filter((action: ZtoAction<any>) => action.header.loaderStart === true),
    map((action: ZtoAction<any>) => new LoaderStartCommand(
      {content: action.header.loaderContent},
      action.header.correlation,
    )),
  );
  @Effect()
  stop = this.actions$.pipe(
    filter(() => environment.withLoader),
    ofZto(),
    filter((action: ZtoAction<any>) => action.header.loaderStart === false),
    map((action: ZtoAction<any>) => new LoaderStopCommand(action.header.correlation)),
  );
}

@Injectable()
export class LoggerEffects {
  constructor(public actions$: Actions, public store: Store<any>) {}
  @Effect({dispatch: false})
  logActions = this.actions$.pipe(
    filter(() => environment.logActions),
    tap((action: Action) => console.log('LoggerEffects@Effect.logActions: ', action)),
  );
  @Effect({dispatch: false})
  logStore = this.store.pipe(
    filter(() => environment.logStores),
    tap((state: any) => console.log('LoggerEffects@Effect.logStore: ', state)),
  );
}
