import { Action } from '@ngrx/store';
import { getUid } from './helpers';

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
export class ZtoError<T = any> extends ZtoReply<T> {}
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

export abstract class ZtoBaseAction<T = any> implements ZtoAction<T>, Action {
  abstract type: string;
  abstract header: ZtoHeader;
  abstract payload?: T;
}
