import { Action } from '@ngrx/store';
import { ZtoCommand } from '../zto-store/models';

export enum ZtoSampleActionTypes {
  setName = '[Zto Sample] Set Name',
}
export class ZtoSampleSetName extends ZtoCommand<{name: string}> {
  constructor(public payload: {name: string}) {
    super(ZtoSampleActionTypes.setName);
  }
}
export type ZtoSampleActions = ZtoSampleSetName;
