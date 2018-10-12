import { Action } from '@ngrx/store';

export enum LoaderActionTypes {
  start = '[loader] start',
  stop = '[loader] stop',
}

export class LoaderStart implements Action {
  type = LoaderActionTypes.start;
  constructor(public payload: {
    content: string,
    source: string,
  }) {}
}

export class LoaderStop implements Action {
  type = LoaderActionTypes.stop;
  constructor(public payload: {source: string}) {}
}

export type LoaderActions = LoaderStart|LoaderStop;
