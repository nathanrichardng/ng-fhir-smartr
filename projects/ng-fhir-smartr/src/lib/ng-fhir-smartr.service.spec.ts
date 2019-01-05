import { TestBed } from '@angular/core/testing';

import { NgFhirSmartrService } from './ng-fhir-smartr.service';

describe('NgFhirSmartrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgFhirSmartrService = TestBed.get(NgFhirSmartrService);
    expect(service).toBeTruthy();
  });
});
