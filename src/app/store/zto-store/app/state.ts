export interface AppState {
  name: string;
  version: string;
  networkStatus: boolean;
  lang: string;
  initialized: boolean;
}
export const initialAppState: AppState = {
  name: 'zto-starter',
  version: '1.0.0',
  networkStatus: false,
  lang: 'fr',
  initialized: false,
};
