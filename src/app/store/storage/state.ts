// STATE TEMPLATE:

export interface StorageState {
  loaded: boolean;
  storage: {
      [id: string]: string;
  };
}
export const initialStorageState: StorageState = {
  loaded: false,
  storage: {},
};
