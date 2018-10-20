import {
  ZtoEvent,
  ZtoSequence,
  loadingStartFactory,
  loadingStopFactory,
  mergeHeaders,
  correlationFactory,
  correlatedFactory
} from '../zto-store/models';

export enum AppActionTypes {
  name = '[App] Name',
  version = '[App] Version',
  lang = '[App] Lang',
  initialize = '[App] Initialize',
  ready = '[App] Ready',
}
export class AppName extends ZtoEvent<{name: string}> {
  constructor(public payload: {name: string}) {
    super(AppActionTypes.name);
  }
}
export class AppVersion extends ZtoEvent<{version: string}> {
  constructor(public payload: {version: string}) {
    super(AppActionTypes.version);
  }
}
export class AppLang extends ZtoEvent<{lang: string}> {
  constructor(public payload: {lang: string}) {
    super(AppActionTypes.lang);
  }
}
export class AppInitialize extends ZtoSequence {
  constructor(length: number) {
    super(AppActionTypes.initialize, length, mergeHeaders(
      correlationFactory(AppActionTypes.initialize),
      loadingStartFactory(AppActionTypes.initialize, 'Initializing App ...'),
    ));
  }
}
export class AppReady extends ZtoEvent {
  constructor(initialize: AppInitialize) {
    super(AppActionTypes.ready, mergeHeaders(
      correlatedFactory(initialize.header),
      loadingStopFactory(initialize.header)
    ));
  }
}
export type AppActions = AppName|AppVersion|AppLang|AppInitialize|AppReady;
