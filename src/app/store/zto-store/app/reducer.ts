import { AppState, initialAppState } from './state';
import {
  AppActions,
  AppActionTypes,
  AppName,
  AppVersion,
  AppLang,
  AppOnline,
  AppOffline
} from './actions';

export function appStateReducer(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.name: {
      const typeAction = action as AppName;
      return {
        ...state,
        name: typeAction.payload.name,
      };
    }
    case AppActionTypes.version: {
      const typeAction = action as AppVersion;
      return {
        ...state,
        version: typeAction.payload.version,
      };
    }
    case AppActionTypes.lang: {
      const typeAction = action as AppLang;
      return {
        ...state,
        lang: typeAction.payload.lang,
      };
    }
    case AppActionTypes.online: {
      const typeAction = action as AppOnline;
      return {
        ...state,
        networkStatus: true,
      };
    }
    case AppActionTypes.offline: {
      const typeAction = action as AppOffline;
      return {
        ...state,
        networkStatus: false,
      };
    }
    case AppActionTypes.initialized: {
      return {
        ...state,
        initialized: true,
      };
    }
    case AppActionTypes.initialize:
    case AppActionTypes.checkNetworkStatus:
    default: {
      return state;
    }
  }
}
