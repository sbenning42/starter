import { StorageState, initialStorageState } from './state';
import {
  StorageActions,
  StorageClearReply,
  StorageClearRequest,
  StorageSaveReply,
  StorageSaveRequest,
  StorageLoadReply,
  StorageLoadRequest,
  StorageActionTypes,
  StorageDeleteReply
} from './actions';

// REDUCER TEMPLATE:

export function storageStateReducer(
  state: StorageState = initialStorageState,
  typedAction: StorageActions
): StorageState {
  switch (typedAction.type) {
    case StorageActionTypes.ClearReply: {
      const action = typedAction as StorageClearReply;
      return {
        ...state,
        storage: {},
      };
    }
    case StorageActionTypes.SaveReply: {
      const action = typedAction as StorageSaveReply;
      return {
        ...state,
        storage: action.payload.storage,
      };
    }
    case StorageActionTypes.FirstLoadReply:
    case StorageActionTypes.LoadReply: {
      const action = typedAction as StorageLoadReply;
      return {
        ...state,
        storage: action.payload.storage,
        loaded: true,
      };
    }
    case StorageActionTypes.DeleteReply: {
      const action = typedAction as StorageDeleteReply;
      delete state.storage[action.payload.key];
      return {
        ...state,
        storage: {...state.storage},
      };
    }
    case StorageActionTypes.ClearRequest:
    case StorageActionTypes.SaveRequest:
    case StorageActionTypes.FirstLoadRequest:
    case StorageActionTypes.LoadRequest:
    case StorageActionTypes.DeleteRequest:
    default:
      return state;
  }
}
