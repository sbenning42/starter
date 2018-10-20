export interface AppState {
  name: string;
  version: string;
  lang: string;
  ready: boolean;
}
export const initialAppState: AppState = {
  name: 'Sample Name',
  version: '1.0.0',
  lang: 'fr',
  ready: false,
};
