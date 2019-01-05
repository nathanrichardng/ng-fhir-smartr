import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFhirSmartrComponent } from './ng-fhir-smartr.component';

describe('NgFhirSmartrComponent', () => {
  let component: NgFhirSmartrComponent;
  let fixture: ComponentFixture<NgFhirSmartrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgFhirSmartrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgFhirSmartrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
