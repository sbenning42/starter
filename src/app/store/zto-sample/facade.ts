import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ZtoSampleState } from './state';
import { ZtoSampleSetName } from './actions';

@Injectable()
export class ZtoSampleFacade {
  ztoSample$: Observable<ZtoSampleState> = this.store.pipe(
    select((root: any) => root.ztoSample as ZtoSampleState)
  );
  name$: Observable<string> = this.store.pipe(
    select((root: any) => (root.ztoSample as ZtoSampleState).name)
  );
  constructor(private store: Store<any>) {}
  setName(name: string) {
    this.store.dispatch(new ZtoSampleSetName({name}));
  }
}
