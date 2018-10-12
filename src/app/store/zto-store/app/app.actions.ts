import { Action } from '@ngrx/store';

export enum AppActionTypes {
  name = '[app] name',
  version = '[app] version',
}

export class AppName implements Action {
  type = AppActionTypes.name;
  constructor(public payload: {name: string}) {}
}

export class AppVersion implements Action {
  type = AppActionTypes.version;
  constructor(public payload: {version: string}) {}
}

export type AppActions = AppName|AppVersion;
