import { Action, Store, select } from '@ngrx/store';
import { OperatorFunction, Observable, of, MonoTypeOperatorFunction, throwError } from 'rxjs';
import { switchMap, map, catchError, filter, delay, tap } from 'rxjs/operators';
import { Injectable, Component } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { LoaderService } from '../services/loader/loader.service';

export interface ZtoHeaderOptions {
  withUid?: boolean;
  withTimestamp?: boolean;
  withSource?: boolean;
  withCorrelation?: boolean;
  withSequence?: boolean;
  withAsyncStart?: boolean;
  withAsyncStop?: boolean;
  withErrorHandling?: boolean;
  isCorrelated?: boolean;
  isSequenced?: boolean;
  isAnErrorEvent?: boolean;
}

export interface ZtoHeader {
  [key: string]: ZtoHeader|any;
}

export interface ZtoAction<T = any> extends Action {
  header: ZtoHeader;
  payload: T;
}

export abstract class ZtoBaseAction<T = any> implements ZtoAction<T> {
  abstract type: string;
  constructor(public payload: T, public header: ZtoHeader) {}
}

export abstract class ZtoDocument<T = any> extends ZtoBaseAction<T> {
  constructor(payload: T, header: ZtoHeader) {
    super(payload, header);
    this.header = mergeHeaders(this.header, headerFactory({withUid: true}));
  }
}

export abstract class ZtoEvent<T = any> extends ZtoBaseAction<T> {
  constructor(payload: T, header: ZtoHeader) {
    super(payload, header);
    this.header = mergeHeaders(this.header, headerFactory({withTimestamp: true}));
  }
}

export abstract class ZtoCommand<T = any> extends ZtoBaseAction<T> {
  constructor(payload: T, header: ZtoHeader) {
    super(payload, header);
    this.header = mergeHeaders(this.header, headerFactory(
      {withCorrelation: true},
      {correlation: {type: 'ZtoBaseAction'}}
    ));
  }
}

export abstract class ZtoRequest<T = any> extends ZtoCommand<T> {
  constructor(payload: T, header: ZtoHeader) {
    super(payload, header);
    this.header = mergeHeaders(this.header, headerFactory(
      {withAsyncStart: true, withErrorHandling: true},
      {async: {type: 'ZtoRequest', content: ''}},
    ));
  }
}

export class ZtoBaseRequest extends ZtoRequest<{}> {
  type = '[Zto] Base Request';
  constructor(opts: any = {}) {
    super({}, {});
    if (opts.type !== undefined) {
      this.header.correlation.type = opts.type;
      this.header.async.type = opts.type;
    }
    if (opts.content !== undefined) {
      this.header.async.content = opts.content;
    }
  }
}

export abstract class ZtoReply<T = any> extends ZtoEvent<T> {
  abstract type: string;
  constructor(payload: T, requestHeader: ZtoHeader, header: ZtoHeader) {
    super(payload, header);
    this.header = mergeHeaders(this.header, headerFactory(
      {isCorrelated: true, withAsyncStop: true},
      {
        correlation: {uid: requestHeader.correlation.uid, type: requestHeader.correlation.type},
        async: {uid: requestHeader.async.uid, type: requestHeader.async.type},
      },
    ));
  }
}

export class ZtoBaseReply<T = any> extends ZtoReply<T> {
  type = '[Zto] Base Reply';
  constructor(payload: T, requestHeader: ZtoHeader) {
    super(payload, requestHeader, {});
  }
}

export interface ErrorPayload {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
}
export abstract class ZtoError extends ZtoReply<ErrorPayload> {
  abstract type: string;
  constructor(payload: ErrorPayload, requestHeader: ZtoHeader, header: ZtoHeader) {
    super(payload, requestHeader, header);
    this.header = mergeHeaders(this.header, headerFactory({isAnErrorEvent: true}));
    this.payload.error.name = <string>payload.error.name;
    this.payload.error.message = <string>payload.error.message;
    this.payload.error.stack = <string>payload.error.stack;
  }
}
export class ZtoBaseError extends ZtoError {
  type = '[Zto] Base Error';
  constructor(payload: ErrorPayload, requestHeader: ZtoHeader) {
    super(payload, requestHeader, {});
  }
}
export class ZtoAsyncStart extends ZtoEvent<{content: string}> {
  type = '[Zto] Async Start';
  constructor(payload: {content: string}, header: ZtoHeader) {
    super(payload, {});
    this.header = mergeHeaders(this.header, headerFactory(
      {isCorrelated: true},
      {correlation: {uid: header.async.uid, type: header.async.type}},
    ));
  }
}
export class ZtoAsyncStop extends ZtoEvent<{}> {
  type = '[Zto] Async Stop';
  constructor(header: ZtoHeader) {
    super({}, {});
    this.header = mergeHeaders(this.header, headerFactory(
      {isCorrelated: true},
      {correlation: {uid: header.async.uid, type: header.async.type}},
    ));
  }
}

export function uidHeaderFactory(): ZtoHeader {
  return {uid: getUid()};
}
export function timestampHeaderFactory(): ZtoHeader {
  return {timestamp: Date.now()};
}
export function sourceHeaderFactory(source: string): ZtoHeader {
  return {source};
}
export function correlationHeaderFactory(type: string): ZtoHeader {
  return {correlation: {uid: getUid(), type}};
}
export function correlatedHeaderFactory(uid: string, type: string): ZtoHeader {
  return {correlation: {uid, type}};
}
export function sequenceHeaderFactory(type: string, length: number): ZtoHeader {
  return {sequence: {uid: getUid(), type, length, index: 0}};
}
export function sequencedHeaderFactory(uid: string, type: string, length: number, index: number): ZtoHeader {
  return {sequence: {uid, type, length, index}};
}
export function asyncStartHeaderFactory(type: string, content: string): ZtoHeader {
  return {async: {uid: getUid(), type, content, start: true}};
}
export function asyncStopHeaderFactory(uid: string, type: string): ZtoHeader {
  return {async: {uid, type, start: false}};
}
export function handleErrorHeaderFactory(): ZtoHeader {
  return {handleError: true};
}
export function errorEventHeaderFactory(): ZtoHeader {
  return {errorEvent: true};
}
export function headerFactory(headerOptions: ZtoHeaderOptions = {}, typedHeader: ZtoHeader = {}): ZtoHeader {
  const header = typedHeader as any;
  return {
    ...(headerOptions.withUid ?
      uidHeaderFactory() : {}),
    ...(headerOptions.withTimestamp ?
      timestampHeaderFactory() : {}),
    ...(headerOptions.withSource ?
      sourceHeaderFactory(header.source) : {}),
    ...(headerOptions.withCorrelation && header.correlation ?
      correlationHeaderFactory(header.correlation.type) : {}),
    ...(headerOptions.isCorrelated && header.correlation ?
      correlatedHeaderFactory(header.correlation.uid, header.correlation.type) : {}),
    ...(headerOptions.withSequence && header.sequence ?
      sequenceHeaderFactory(header.sequence.type, header.sequence.length) : {}),
    ...(headerOptions.isSequenced && header.sequence ?
      sequencedHeaderFactory(
        header.sequence.uid,
        header.sequence.type,
        header.sequence.length,
        header.sequence.index,
      ) : {}),
    ...(headerOptions.withAsyncStart && header.async ?
      asyncStartHeaderFactory(header.async.type, header.async.content) : {}),
    ...(headerOptions.withAsyncStop && header.async ?
      asyncStopHeaderFactory(header.async.uid, header.async.type) : {}),
    ...(headerOptions.withErrorHandling ?
      handleErrorHeaderFactory() : {}),
    ...(headerOptions.isAnErrorEvent ?
      errorEventHeaderFactory() : {}),
  };
}
export function mergeHeaders(...headers: ZtoHeader[]): ZtoHeader {
  const header = {};
  headers.forEach(h => Object.entries(h).forEach(([k, v]) => header[k] = header[k] ? ({...header[k], ...v}) : v));
  return header;
}

export function requestReply<T, U>(
  sideEffect$: Observable<any>,
  replyFactory: (response: any, request: ZtoRequest<T>) => ZtoReply<U>,
  errorFactory: (error: Error, request: ZtoRequest<T>) => ZtoError
    = (error: Error, request: ZtoRequest<T>) => new ZtoBaseError({error}, request.header)
): OperatorFunction<ZtoRequest<T>, (ZtoReply<U>|ZtoError)> {
  return (request$: Observable<ZtoRequest<T>>) => request$.pipe(
    switchMap((request: ZtoRequest<T>) => sideEffect$.pipe(
      map((response: any) => replyFactory(response, request)),
      catchError((err: Error) => request.header.handleError === true ?
        of(errorFactory(err, request)) : throwError(err)),
    )),
  );
}
export function ofType(type: string): MonoTypeOperatorFunction<Action> {
  return (actions$: Observable<Action>) => actions$.pipe(
    filter((action: Action) => action.type === type)
  );
}

export interface SampleState {
  fetched: boolean;
  pending: boolean;
  data: any;
}
export const initialSampleState: SampleState = {
  fetched: false,
  pending: false,
  data: undefined,
};
export enum SampleActionType {
  fetchRequest = '[Sample] Fetch Data Request',
  fetchReply = '[Sample] Fetch Data Reply',
  fetchError = '[Sample] Fetch Data Error'
}
export class SampleFetchReq extends ZtoBaseRequest {
  type = SampleActionType.fetchRequest;
  constructor() {
    super({
      type: SampleActionType.fetchRequest,
      content: 'Sample Fetch Request Pending',
    });
  }
}
export class SampleFetchRep extends ZtoBaseReply<{data: any}> {
  type = SampleActionType.fetchReply;
}
export class SampleFetchErr extends ZtoBaseError {
  type = SampleActionType.fetchError;
}
export type SampleActions = SampleFetchReq|SampleFetchRep|SampleFetchErr;
export function sampleStateReducer(state: SampleState = initialSampleState, action: SampleActions): SampleState {
  switch (action.type) {
    case SampleActionType.fetchRequest:
      return {
        ...state,
        pending: true,
      };
    case SampleActionType.fetchReply:
      return  {
        ...state,
        pending: false,
        fetched: true,
        data: (<SampleFetchRep>action).payload.data,
      };
    case SampleActionType.fetchError:
      return {
        ...state,
        pending: false,
      };
    default:
      return state;
  }
}
@Injectable()
export class SampleService {
  private map(response: any): any {
    if (Math.random() > 0.7) {
      throw new Error('Mouhahaha');
    }
    return response;
  }
  fetch(): Observable<{greatings: string}> {
    return of({greatings: 'Hello World !'}).pipe(
      delay(5000),
      map((response: any) => this.map(response)),
    );
  }
}
@Injectable()
export class SampleEffects {
  constructor(public actions$: Actions, public sampleService: SampleService, public loader: LoaderService) {}
  @Effect()
  sample = this.actions$.pipe(
    ofType(SampleActionType.fetchRequest),
    requestReply(this.sampleService.fetch(),
      (response: any, request: SampleFetchReq) => new SampleFetchRep({data: response}, request.header),
      (error: Error, request: SampleFetchReq) => new SampleFetchErr({error}, request.header),
    ),
  );

  asyncCache = {};
  @Effect()
  logAsyncStart = this.actions$.pipe(
    filter((action: Action) => !!(<ZtoAction>action).header),
    filter((action: ZtoAction) => !!action.header.async),
    filter((action: ZtoAction) => action.header.async.start === true),
    tap((action: ZtoAction) => this.asyncCache[action.header.async.uid] = {
      type: action.header.async.type,
      content: action.header.async.content,
    }),
    // tap((action: ZtoAction) => console.log('Async task started: ', this.asyncCache)),
    map((action: ZtoAction) => new ZtoAsyncStart({content: action.header.async.content}, action.header)),
    tap((action: ZtoAsyncStart) => this.loader.openDialog(action.payload.content)),
  );
  @Effect()
  logAsyncStop = this.actions$.pipe(
    filter((action: Action) => !!(<ZtoAction>action).header),
    filter((action: ZtoAction) => !!action.header.async),
    filter((action: ZtoAction) => action.header.async.start === false),
    tap((action: ZtoAction) => delete this.asyncCache[action.header.async.uid]),
    // tap((action: ZtoAction) => console.log('Async task stoped: ', this.asyncCache)),
    map((action: ZtoAction) => new ZtoAsyncStop(action.header)),
    tap((action: ZtoAsyncStart) => this.loader.closeDialog()),
  );
}
@Injectable()
export class SampleFacade {
  sampleData$ = this.store.pipe(select((root: any) => root.sample.data));
  sampleFetched$ = this.store.pipe(select((root: any) => root.sample.fetched));
  samplePending$ = this.store.pipe(select((root: any) => root.sample.pending));
  constructor(public store: Store<any>) {}
  fetch() {
    this.store.dispatch(new SampleFetchReq);
  }
}
@Component({
  selector: 'app-zto-redux-sample-facade',
  template: `
    <div>
      <h3>Sample State</h3>
      <p>Fetched: {{fetched$|async}}</p>
      <p>Pending: {{pending$|async}}</p>
      <p>Data: {{(data$|async)?.greatings}}</p>
      <button (click)="fetch()">FETCH</button>
    </div>
  `,
  styles: [],
})
export class SampleFacadeComponent {
  data$: Observable<{greatings: string}> = this.sample.sampleData$;
  fetched$: Observable<boolean> = this.sample.sampleFetched$;
  pending$: Observable<boolean> = this.sample.samplePending$;
  constructor(public sample: SampleFacade) {}
  fetch() {
    this.sample.fetch();
  }
}

export function getUid() {
// tslint:disable:no-bitwise
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  // tslint:enable:no-bitwise
}
