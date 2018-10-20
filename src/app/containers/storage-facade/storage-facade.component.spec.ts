import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageFacadeComponent } from './storage-facade.component';

describe('StorageFacadeComponent', () => {
  let component: StorageFacadeComponent;
  let fixture: ComponentFixture<StorageFacadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageFacadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageFacadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
