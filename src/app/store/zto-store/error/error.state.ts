export interface ErrorDocument {
  name: string;
  message: string;
  stack?: string;
  source: string;
}

export interface ErrorState {
  lastErrorHandled: boolean;
  stack: ErrorDocument[];
}
export const initialErrorState: ErrorState = {
  lastErrorHandled: undefined,
  stack: [],
};

