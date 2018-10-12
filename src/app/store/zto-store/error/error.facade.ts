import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ErrorError, ErrorAdd, ErrorClear, ErrorHandle } from './error.actions';
import { ErrorState, ErrorDocument } from './error.state';

@Injectable()
export class ErrorFacade {

  get error$(): Observable<ErrorState> {
    return this.store.pipe(
      select((state: any) => state.error)
    );
  }

  get stack$(): Observable<ErrorDocument[]> {
    return this.store.pipe(
      select((state: any) => state.error.stack)
    );
  }

  get lastErrorHandled$(): Observable<boolean> {
    return this.store.pipe(
      select((state: any) => state.error.lastErrorHandled)
    );
  }

  constructor (
    private store: Store<any>
  ) {}

  error(error: Error, source?: string): void {
    this.store.dispatch(new ErrorError({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        source: source
      }
    }));
  }

  add(error: Error, source?: string): void {
    this.store.dispatch(new ErrorAdd({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        source: source
      }
    }));
  }

  clear(): void {
    this.store.dispatch(new ErrorClear);
  }

  handle(): void {
    this.store.dispatch(new ErrorHandle);
  }

}
