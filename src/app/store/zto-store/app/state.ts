export interface AppState {
  name: string;
  version: string;
  networkStatus: boolean;
  lang: string;
  initialized: boolean;
  localStorageFetched: boolean;
  localStorage: {[key: string]: string};
  localStorageDirty: {[key: string]: boolean};
}
export const initialAppState: AppState = {
  name: 'zto-starter',
  version: '1.0.0',
  networkStatus: false,
  lang: 'fr',
  initialized: false,
  localStorageFetched: false,
  localStorage: undefined,
  localStorageDirty: undefined,
};
