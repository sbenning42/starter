import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCreatorComponent } from './action-creator.component';

describe('ActionCreatorComponent', () => {
  let component: ActionCreatorComponent;
  let fixture: ComponentFixture<ActionCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
