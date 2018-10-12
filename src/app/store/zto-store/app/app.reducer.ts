import {
  AppState,
  initialAppState
} from './app.state';
import {
  AppActions,
  AppActionTypes,
  AppName,
  AppVersion
} from './app.actions';

export function appReducer(state: AppState = initialAppState, action: AppActions): AppState {
  switch (action.type) {

    case AppActionTypes.name: {
      const nameAction = action as AppName;
      return {
        ...state,
        name: nameAction.payload.name,
      };
    }

    case AppActionTypes.version: {
      const versionAction = action as AppVersion;
      return {
        ...state,
        version: versionAction.payload.version,
      };
    }

    default: {
      return state;
    }

  }
}
