import { ZtohubState, initialZtohubState } from './state';
import { ZtohubActions, ZtohubActionTypes, ZtohubThemes, ZtohubThemesFetched, ZtohubFiltersFetched, ZtohubFilters } from './actions';

export function ztohubStateReducer(state: ZtohubState = initialZtohubState, action: ZtohubActions): ZtohubState {
  switch (action.type) {
    case ZtohubActionTypes.themesFetched: {
      const typeAction = action as ZtohubThemesFetched;
      return {
        ...state,
        themesFetched: true,
      };
    }
    case ZtohubActionTypes.themes: {
      const typeAction = action as ZtohubThemes;
      return {
        ...state,
        themes: typeAction.payload.themes,
      };
    }
    case ZtohubActionTypes.filtersFetched: {
      const typeAction = action as ZtohubFiltersFetched;
      return {
        ...state,
        filtersFetched: true,
      };
    }
    case ZtohubActionTypes.filters: {
      const typeAction = action as ZtohubFilters;
      return {
        ...state,
        filters: typeAction.payload.filters,
      };
    }
    case ZtohubActionTypes.themesFetch:
    case ZtohubActionTypes.filtersFetch:
    default: {
      return state;
    }
  }
}
