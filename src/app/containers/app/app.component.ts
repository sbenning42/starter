import { Component, OnInit } from '@angular/core';
import { AppFacade } from 'src/app/store/app/facade';

@Component({
  selector: 'app-app-state',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppStateComponent implements OnInit {

  name$ = this.appFacade.name$;
  version$ = this.appFacade.version$;
  lang$ = this.appFacade.lang$;
  ready$ = this.appFacade.ready$;

  name = '';
  version = '';
  lang = '';

  constructor(public appFacade: AppFacade) { }

  ngOnInit() {
  }

  initialize() {
    this.appFacade.initialize();
  }

  update() {
    this.appFacade.name(this.name);
    this.appFacade.version(this.version);
    this.appFacade.lang(this.lang);
    this.name = '';
    this.version = '';
    this.lang = '';
  }

}
