import { AppState, initialAppState } from './state';
import {
  AppActions,
  AppActionTypes,
  AppName,
  AppVersion,
  AppLang,
  AppOnline,
  AppOffline,
  AppLsFetched,
  AppLsDocument,
  AppLsSaved
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
    case AppActionTypes.localStorageFetched: {
      const typeAction = action as AppLsFetched;
      return {
        ...state,
        localStorageFetched: true,
        localStorage: typeAction.payload.storage,
      };
    }
    case AppActionTypes.localStorageDocument: {
      const typeAction = action as AppLsDocument;
      return {
        ...state,
        localStorage: typeAction.payload.storage,
      };
    }
    case AppActionTypes.localStorageSaved: {
      const typeAction = action as AppLsSaved;
      return {
        ...state,
        localStorageDirty: {},
      };
    }
    case AppActionTypes.localStorageFetch:
    case AppActionTypes.localStorageSave:
    case AppActionTypes.initialize:
    case AppActionTypes.checkNetworkStatus:
    default: {
      return state;
    }
  }
}
