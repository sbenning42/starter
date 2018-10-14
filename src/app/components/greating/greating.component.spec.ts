import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GreatingComponent } from './greating.component';

describe('GreatingComponent', () => {
  let component: GreatingComponent;
  let fixture: ComponentFixture<GreatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
