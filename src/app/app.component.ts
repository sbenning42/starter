import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppFacade } from './store/zto-store/app/app.facade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  name$: Observable<string>;
  version$: Observable<string>;

  constructor(public appFacade: AppFacade) {
    this.name$ = this.appFacade.name$;
    this.version$ = this.appFacade.version$;
  }

}
