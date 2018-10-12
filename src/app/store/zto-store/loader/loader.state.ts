export interface LoaderState {
  loading: boolean;
  content: string;
  source: string;
}
export const initialLoaderState: LoaderState = {
  loading: false,
  content: undefined,
  source: undefined,
};

