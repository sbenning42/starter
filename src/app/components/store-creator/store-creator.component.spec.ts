import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCreatorComponent } from './store-creator.component';

describe('StoreCreatorComponent', () => {
  let component: StoreCreatorComponent;
  let fixture: ComponentFixture<StoreCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
