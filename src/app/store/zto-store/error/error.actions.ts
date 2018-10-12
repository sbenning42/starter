import { Action } from '@ngrx/store';
import { ErrorDocument } from './error.state';

export enum ErrorActionTypes {
  add = '[error] add',
  error = '[error] error',
  clear = '[error] clear',
  handle = '[error] handle',
}

export class ErrorAdd implements Action {
  type = ErrorActionTypes.add;
  constructor(public payload: {error: ErrorDocument}) {}
}

export class ErrorError implements Action {
  type = ErrorActionTypes.error;
  constructor(public payload: {error: ErrorDocument}) {}
}

export class ErrorClear implements Action {
  type = ErrorActionTypes.clear;
}

export class ErrorHandle implements Action {
  type = ErrorActionTypes.handle;
}

export type ErrorActions = ErrorAdd
|ErrorError
|ErrorClear
|ErrorHandle;
