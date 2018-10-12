import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoaderStart, LoaderStop } from './loader.actions';
import { LoaderState } from './loader.state';

@Injectable()
export class LoaderFacade {

  get loader$(): Observable<LoaderState> {
    return this.store.pipe(
      select((state: any) => state.loader)
    );
  }

  get loading$(): Observable<boolean> {
    return this.store.pipe(
      select((state: any) => state.loader.loading)
    );
  }

  get content$(): Observable<string> {
    return this.store.pipe(
      select((state: any) => state.loader.content)
    );
  }

  get source$(): Observable<string> {
    return this.store.pipe(
      select((state: any) => state.loader.source)
    );
  }

  constructor (
    private store: Store<any>
  ) {}

  start(content: string, source: string): void {
    this.store.dispatch(new LoaderStart({content, source}));
  }

  stop(source: string): void {
    this.store.dispatch(new LoaderStop({source}));
  }

}
