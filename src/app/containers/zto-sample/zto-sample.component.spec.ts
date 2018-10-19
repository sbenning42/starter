import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZtoSampleComponent } from './zto-sample.component';

describe('ZtoSampleComponent', () => {
  let component: ZtoSampleComponent;
  let fixture: ComponentFixture<ZtoSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZtoSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZtoSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
