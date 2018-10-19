import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-greating',
  templateUrl: './greating.component.html',
  styleUrls: ['./greating.component.css']
})
export class GreatingComponent implements OnInit {

  @Input() name: string;
  @Input() version: string;
  @Input() lang: string;

  constructor() { }

  ngOnInit() {
  }

}
