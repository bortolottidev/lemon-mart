import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import {commonTestingModules, commonTestingProviders} from '../common/common.testing';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: commonTestingModules,
      providers: commonTestingProviders.concat(AuthGuardService),
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
