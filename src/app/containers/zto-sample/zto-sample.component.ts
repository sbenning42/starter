import { Component, OnInit } from '@angular/core';
import { ZtoSampleFacade } from '../../store/zto-sample/facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-zto-sample',
  templateUrl: './zto-sample.component.html',
  styleUrls: ['./zto-sample.component.css']
})
export class ZtoSampleComponent implements OnInit {

  name$: Observable<string> = this.ztoSample.name$;
  name = '';

  constructor(public ztoSample: ZtoSampleFacade) { }

  ngOnInit() {
  }

  private reset() {
    this.name = '';
  }

  update() {
    this.ztoSample.setName(this.name);
    this.reset();
  }

}
