export interface ZtohubState {
  themesFetched: boolean;
  filtersFetched: boolean;
  themes: any[];
  filters: any[];
}

export const initialZtohubState: ZtohubState = {
  themesFetched: false,
  filtersFetched: false,
  themes: undefined,
  filters: undefined,
};
