import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorService } from './services/error/error.service';
import { LoaderService } from './services/loader/loader.service';
import { AppFacade } from './store/zto-store/app/facade';
import { tap, map } from 'rxjs/operators';
import { SampleFacade } from './store/zto-redux-helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  initialized$: Observable<boolean>;
  firstVisit$: Observable<boolean>;

  name$: Observable<string>;
  version$: Observable<string>;
  lang$: Observable<string>;

  constructor(
    public errorService: ErrorService,
    public loaderService: LoaderService,
    public appFacade: AppFacade,
    public sampleFacade: SampleFacade,
  ) {
    this.initialized$ = this.appFacade.initialized$;
    this.firstVisit$ = this.appFacade.localStorage$.pipe(
      map((localStorageCache: {[key: string]: string}) => localStorageCache.firstVisit !== 'false'),
    );

    this.name$ = this.appFacade.name$;
    this.version$ = this.appFacade.version$;
    this.lang$ = this.appFacade.lang$;

    this.initialize();
  }

  initialize() {
    this.loaderService.startRun();
    this.errorService.startRun();
    // this.appFacade.initialize();
    this.sampleFacade.fetch();
  }

  visit() {
    this.appFacade.localStorage({firstVisit: JSON.stringify(false)});
  }

}
