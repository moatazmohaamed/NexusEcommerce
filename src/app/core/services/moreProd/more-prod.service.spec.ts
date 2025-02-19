import { TestBed } from '@angular/core/testing';

import { MoreProdService } from './more-prod.service';

describe('MoreProdService', () => {
  let service: MoreProdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoreProdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
