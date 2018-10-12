import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppName, AppVersion } from './app.actions';
import { AppState } from './app.state';

@Injectable()
export class AppFacade {

  get app$(): Observable<AppState> {
    return this.store.pipe(
      select((state: any) => state.app)
    );
  }

  get name$(): Observable<string> {
    return this.store.pipe(
      select((state: any) => state.app.name)
    );
  }

  get version$(): Observable<string> {
    return this.store.pipe(
      select((state: any) => state.app.version)
    );
  }

  constructor (
    private store: Store<any>
  ) {}

  changeName(name: string): void {
    this.store.dispatch(new AppName({name}));
  }

  changeVersion(version: string): void {
    this.store.dispatch(new AppVersion({version}));
  }

}
