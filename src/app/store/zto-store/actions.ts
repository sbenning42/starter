import { ZtoAction, ZtoHeader } from './models';

export enum ZtoActionTypes {
  addCorrelation = '[Zto] Add Correlation',
  resolveCorrelation = '[Zto] Resolve Correlation',
  addSequence = '[Zto] Add Sequence',
  resolveSequence = '[Zto] Resolve Sequence',
  addLoading = '[Zto] Add Loading',
  resolveLoading = '[Zto] Resolve Loading',
  addError = '[Zto] Add Error',
  resolveError = '[Zto] Resolve Error',
}
export class AddCorrelation implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.addCorrelation;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class AddSequence implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.addSequence;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class AddLoading implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.addLoading;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class AddError implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.addError;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class ResolveCorrelation implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.resolveCorrelation;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class ResolveSequence implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.resolveSequence;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class ResolveLoading implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.resolveLoading;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export class ResolveError implements ZtoAction<ZtoHeader> {
  type = ZtoActionTypes.resolveError;
  header = {};
  constructor(public payload: ZtoHeader) {}
}
export type ZtoActions = AddCorrelation|AddSequence|AddLoading|AddError
|ResolveCorrelation|ResolveSequence|ResolveLoading|ResolveError;
