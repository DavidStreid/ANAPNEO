import { TestBed } from '@angular/core/testing';

import { AnapneoLibService } from './anapneo-lib.service';

describe('AnapneoLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnapneoLibService = TestBed.get(AnapneoLibService);
    expect(service).toBeTruthy();
  });
});
