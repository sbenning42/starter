import { ZtoState, initialZtoState } from './state';
import { ZtoActions, ZtoActionTypes } from './actions';

function findOldestId(resolved: {[id: string]: {timestamp?: number}}): string {
  return Object.entries(resolved)
    .reduce(([oldId, oldTs], [id, {timestamp: ts}]) => !oldId || !oldTs || oldTs > ts ?
      [id, ts] : [oldId, oldTs],
    [])[0];
}

export function ztoStateReducer(state: ZtoState = initialZtoState, action: ZtoActions): ZtoState {
  switch (action.type) {
    case ZtoActionTypes.addCorrelation:
      return {
        ...state,
        pendingCorrelations: {...state.pendingCorrelations, [action.payload.correlationId]: {
          correlationId: action.payload.correlationId,
          correlationType: action.payload.correlationType,
        }},
      };
    case ZtoActionTypes.addSequence: {
      const stack = state.pendingSequences[action.payload.sequenceId] || [];
      return {
        ...state,
        pendingSequences: {...state.pendingSequences, [action.payload.sequenceId]: [...stack, {
          sequenceId: action.payload.sequenceId,
          sequenceType: action.payload.sequenceType,
          sequenceLength: action.payload.sequenceLength,
        }]},
      };
    }
    case ZtoActionTypes.addLoading:
      return {
        ...state,
        pendingLoadings: {...state.pendingLoadings, [action.payload.loadingId]: {
          loadingId: action.payload.loadingId,
          loadingType: action.payload.loadingType,
          loadingContent: action.payload.loadingContent,
        }},
      };
    case ZtoActionTypes.addError:
      return {
        ...state,
        pendingErrors: {...state.pendingErrors, [action.payload.errorId]: {
          errorId: action.payload.errorId,
          errorType: action.payload.errorType,
          errorContent: action.payload.errorContent,
        }},
      };
    case ZtoActionTypes.resolveCorrelation: {
      const resolved = {...state.pendingCorrelations[action.payload.correlationId], timestamp: action.payload.timestamp};
      delete state.pendingCorrelations[action.payload.correlationId];
      state.resolvedCorrelation[action.payload.correlationId] = resolved;
      if (Object.keys(state.resolvedCorrelation).length > 3) {
        const id = findOldestId(state.resolvedCorrelation);
        delete state.resolvedCorrelation[id];
      }
      return {
        ...state,
        pendingCorrelations: {...state.pendingCorrelations},
        resolvedCorrelation: {...state.resolvedCorrelation}
      };
    }
    case ZtoActionTypes.resolveSequence: {
      const resolved = {headers: state.pendingSequences[action.payload.sequenceId], timestamp: action.payload.timestamp};
      delete state.pendingSequences[action.payload.sequenceId];
      state.resolvedSequences[action.payload.sequenceId] = resolved;
      if (Object.keys(state.resolvedSequences).length > 3) {
        const id = findOldestId(state.resolvedSequences);
        delete state.resolvedSequences[id];
      }
      return {
        ...state,
        pendingSequences: {...state.pendingSequences},
        resolvedSequences: {...state.resolvedSequences},
      };
    }
    case ZtoActionTypes.resolveLoading: {
      const resolved = {...state.pendingLoadings[action.payload.loadingId], timestamp: action.payload.timestamp};
      delete state.pendingLoadings[action.payload.loadingId];
      state.resolvedLoadings[action.payload.loadingId] = resolved;
      if (Object.keys(state.resolvedLoadings).length > 3) {
        const id = findOldestId(state.resolvedLoadings);
        delete state.resolvedLoadings[id];
      }
      return {
        ...state,
        pendingLoadings: {...state.pendingLoadings},
        resolvedLoadings: {...state.resolvedLoadings}
      };
    }
    case ZtoActionTypes.resolveError: {
      const resolved = {...state.pendingErrors[action.payload.errorId], timestamp: action.payload.timestamp};
      delete state.pendingErrors[action.payload.errorId];
      state.resolvedErrors[action.payload.errorId] = resolved;
      if (Object.keys(state.resolvedErrors).length > 3) {
        const id = findOldestId(state.resolvedErrors);
        delete state.resolvedErrors[id];
      }
      return {
        ...state,
        pendingErrors: {...state.pendingErrors},
        resolvedErrors: {...state.resolvedErrors}
      };
    }
    default:
      return state;
  }
}
