import { ZtoHeader } from './models';

export interface ZtoState {
  pendingCorrelations: {[id: string]: ZtoHeader};
  pendingSequences: {[id: string]: ZtoHeader[]};
  pendingLoadings: {[id: string]: ZtoHeader};
  pendingErrors: {[id: string]: ZtoHeader};
  resolvedCorrelation: {[id: string]: ZtoHeader};
  resolvedSequences: {[id: string]: {headers: ZtoHeader[], timestamp: number}};
  resolvedLoadings: {[id: string]: ZtoHeader};
  resolvedErrors: {[id: string]: ZtoHeader};
}
export const initialZtoState: ZtoState = {
  pendingCorrelations: {},
  pendingSequences: {},
  pendingLoadings: {},
  pendingErrors: {},
  resolvedCorrelation: {},
  resolvedSequences: {},
  resolvedLoadings: {},
  resolvedErrors: {}
};
