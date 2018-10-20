import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorService } from './services/error/error.service';
import { LoaderService } from './services/loader/loader.service';
import { tap, map } from 'rxjs/operators';
import { ZtoFacade } from './store/zto-store/facade';
import {
  correlationFactory,
  mergeHeaders,
  ZtoRequest,
  ZtoReply,
  ZtoSequence,
  ZtoSequenced,
  loadingStartFactory,
  loadingStopFactory
} from './store/zto-store/models';
import { ZtoSampleFacade } from './store/zto-sample/facade';
import { AppFacade } from './store/app/facade';
import { environment } from 'src/environments/environment';

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
    loader: LoaderService,
    error: ErrorService,
    app: AppFacade
  ) {
    if (environment.withError) {
      error.run();
    }
    if (environment.withLoader) {
      loader.run();
    }
    app.initialize();
    // this.initialize();
  }
/*
  initialize() {

    const ztosRequest = new ZtoSequence('[Zto Sample] s1 request', 4);
    this.ztoFacade.store.dispatch(ztosRequest);
    this.ztoFacade.store.dispatch(new ZtoSequenced('[Zto Sample] s1-1 reply', ztosRequest));
    this.ztoFacade.store.dispatch(new ZtoSequenced('[Zto Sample] s1-2 reply', ztosRequest));
    this.ztoFacade.store.dispatch(new ZtoSequenced('[Zto Sample] s1-3 reply', ztosRequest));

    let ztoRequest;
    setTimeout(() => {
    ztoRequest = new ZtoRequest('[Zto Sample] request', loadingStartFactory('[Zto Sample] request', 'Sample Loader'));
    this.ztoFacade.store.dispatch(ztoRequest);
    }, 500);
    setTimeout(() => {
      this.ztoFacade.store.dispatch(new ZtoReply('[Zto Sample] reply', ztoRequest, loadingStopFactory(ztoRequest.header)));
    }, 1000);

    setTimeout(() => {
      ztoRequest = new ZtoRequest('[Zto Sample] request');
      this.ztoFacade.store.dispatch(ztoRequest);
    }, 1500);
    setTimeout(() => {
      this.ztoFacade.store.dispatch(new ZtoReply('[Zto Sample] reply', ztoRequest));
    }, 2000);

  }
  */

}
