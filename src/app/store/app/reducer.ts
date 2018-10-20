import { AppState, initialAppState } from './state';
import { AppActions, AppActionTypes, AppName, AppVersion, AppLang } from './actions';

export function appStateReducer(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.name:
      return {
        ...state,
        name: (<AppName>action).payload.name,
      };
    case AppActionTypes.version:
      return {
        ...state,
        version: (<AppVersion>action).payload.version,
      };
    case AppActionTypes.lang:
      return {
        ...state,
        lang: (<AppLang>action).payload.lang,
      };
    case AppActionTypes.ready:
      return {
        ...state,
        ready: true,
      };
    case AppActionTypes.initialize:
    default:
      return state;
  }
}
