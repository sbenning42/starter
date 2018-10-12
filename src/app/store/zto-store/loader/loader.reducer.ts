import {
  LoaderState,
  initialLoaderState
} from './loader.state';
import {
  LoaderActions,
  LoaderActionTypes,
  LoaderStart,
  LoaderStop
} from './loader.actions';

export function loaderReducer(state: LoaderState = initialLoaderState, action: LoaderActions): LoaderState {
  switch (action.type) {

    case LoaderActionTypes.start: {
      const startAction = action as LoaderStart;
      return {
        ...state,
        loading: true,
        content: startAction.payload.content,
        source: startAction.payload.source,
      };
    }

    case LoaderActionTypes.stop: {
      action = action as LoaderStop;
      return {
        ...state,
        loading: false,
        content: undefined,
        source: undefined,
      };
    }

    default: {
      return state;
    }

  }
}
