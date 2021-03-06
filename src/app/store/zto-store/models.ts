import { Action } from '@ngrx/store';
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
export interface ZtoHeader {
  uid?: string;
  timestamp?: number;
  source?: string;
  correlationId?: string;
  correlationType?: string;
  sequenceId?: string;
  sequenceType?: string;
  sequenceLength?: number;
  loadingId?: string;
  loadingType?: string;
  loadingContent?: string;
  errorId?: string;
  errorType?: string;
  errorContent?: string;
}
export interface ZtoAction<T = any> extends Action {
  type: string;
  header: ZtoHeader;
  payload?: T;
}

export function uidFactory(): ZtoHeader {
  return {uid: getUid()};
}
export function timestampFactory(): ZtoHeader {
  return {timestamp: Date.now()};
}
export function sourceFactory(source: string): ZtoHeader {
  return {source};
}
export function correlationFactory(type: string): ZtoHeader {
  return {correlationId: getUid(), correlationType: type};
}
export function correlatedFactory(header: ZtoHeader): ZtoHeader {
  return {correlationId: header.correlationId, correlationType: header.correlationType};
}
export function sequenceFactory(type: string, length: number): ZtoHeader {
  return {sequenceId: getUid(), sequenceType: type, sequenceLength: length};
}
export function sequencedFactory(header: ZtoHeader): ZtoHeader {
  return {sequenceId: header.sequenceId, sequenceType: header.sequenceType};
}
export function loadingStartFactory(type: string, content: string): ZtoHeader {
  return {loadingId: getUid(), loadingType: type, loadingContent: content};
}
export function loadingStopFactory(header: ZtoHeader): ZtoHeader {
  return {loadingId: header.loadingId};
}
export function errorStartFactory(type: string, content: string): ZtoHeader {
  return {errorId: getUid(), errorType: type, errorContent: content};
}
export function errorStopFactory(header: ZtoHeader): ZtoHeader {
  return {errorId: header.errorId};
}
export function mergeHeaders(...headers: ZtoHeader[]): ZtoHeader {
  return headers.reduce((mergedHeader: ZtoHeader, header: ZtoHeader = {}) => ({...mergedHeader, ...header}), {});
}

export class ZtoCommand<T = any> implements ZtoAction<T> {
  header: ZtoHeader;
  constructor(public type: string, header: ZtoHeader = {}) {
    this.header = mergeHeaders(
      uidFactory(),
      header
    );
  }
}
export class ZtoEvent<T = any> implements ZtoAction<T> {
  header: ZtoHeader;
  constructor(public type: string, header: ZtoHeader = {}) {
    this.header = mergeHeaders(
      timestampFactory(),
      header
    );
  }
}
export class ZtoRequest<T = any> extends ZtoCommand<T> {
  constructor(type: string, header: ZtoHeader = {}) {
    super(type, mergeHeaders(
      correlationFactory(type),
      header
    ));
  }
}
export class ZtoReply<T = any> extends ZtoEvent<T> {
  constructor(type: string, action: ZtoAction, header: ZtoHeader = {}) {
    super(type, mergeHeaders(
      correlatedFactory(action.header),
      header
    ));
  }
}
export class ZtoError<T = any> extends ZtoReply<T> {
  constructor(type: string, action: ZtoAction, content: string, header: ZtoHeader = {}) {
    super(type, action, mergeHeaders(
      errorStartFactory(type, content),
      action.header.loadingId ? loadingStopFactory(action.header) : {},
      header
    ));
  }
}
export class ZtoResolveError extends ZtoCommand {
  constructor(type: string, action: ZtoAction, header: ZtoHeader = {}) {
    super(type, mergeHeaders(
      errorStopFactory(action.header),
      header
    ));
  }
}
export class ZtoSequence<T = any> extends ZtoCommand<T> {
  constructor(type: string, length: number, header: ZtoHeader = {}) {
    super(type, mergeHeaders(
      sequenceFactory(type, length),
      header
    ));
  }
}
export class ZtoSequenced<T = any> extends ZtoEvent<T> {
  constructor(type: string, action: ZtoAction, header: ZtoHeader = {}) {
    super(type, mergeHeaders(
      sequencedFactory(action.header),
      header
    ));
  }
}
