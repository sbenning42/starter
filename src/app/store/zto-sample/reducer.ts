import { ZtoSampleState, initialZtoSampleState } from './state';
import { ZtoSampleActions, ZtoSampleActionTypes } from './actions';

export function ztoSampleStateReducer(state: ZtoSampleState = initialZtoSampleState, action: ZtoSampleActions): ZtoSampleState {
  switch (action.type) {
    case ZtoSampleActionTypes.setName:
      return {
        ...state,
        name: action.payload.name,
      };
    default:
      return state;
  }
}
