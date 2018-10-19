import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ZtoSampleFacade } from './facade';

@Injectable()
export class ZtoSampleEffects {
  constructor(
    public actions$: Actions,
    public ztoSample: ZtoSampleFacade,
  ) {}
}
