import {
  ErrorState,
  initialErrorState
} from './error.state';
import {
  ErrorActions,
  ErrorActionTypes,
  ErrorAdd,
  ErrorClear,
  ErrorHandle,
  ErrorError,
} from './error.actions';

export function errorReducer(state: ErrorState = initialErrorState, action: ErrorActions): ErrorState {
  switch (action.type) {

    case ErrorActionTypes.add: {
      const addAction = action as ErrorAdd;
      return {
        ...state,
        stack: [
          addAction.payload.error,
          ...state.stack
        ],
      };
    }

    case ErrorActionTypes.error: {
      const errorAction = action as ErrorError;
      return {
        ...state,
        lastErrorHandled: false,
      };
    }

    case ErrorActionTypes.clear: {
      const clearAction = action as ErrorClear;
      return {
        ...state,
        lastErrorHandled: true,
        stack: [],
      };
    }

    case ErrorActionTypes.handle: {
      const handleAction = action as ErrorHandle;
      return {
        ...state,
        lastErrorHandled: true,
      };
    }

    default: {
      return state;
    }

  }
}
