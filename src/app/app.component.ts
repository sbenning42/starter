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
import { AuthService, LinkedinLoginProvider, GoogleLoginProvider, FacebookLoginProvider } from 'angular-6-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  env = environment;

  initialized$: Observable<boolean>;

  constructor(
    loader: LoaderService,
    error: ErrorService,
    app: AppFacade,
    private socialAuthService: AuthService,
  ) {
    if (environment.withError) {
      error.run();
    }
    if (environment.withLoader) {
      loader.run();
    }
    app.initialize();
    this.initialized$ = app.ready$;
  }
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'linkedin') {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ' , userData);
        // Now sign-in with userData
        // ...
      }
    );
  }
}
