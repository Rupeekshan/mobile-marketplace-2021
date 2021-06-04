import { TestBed } from '@angular/core/testing';

import { FirebaseItemService } from './firebase-item.service';

describe('FirebaseItemService', () => {
  let service: FirebaseItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
