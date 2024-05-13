import { TestBed } from '@angular/core/testing';

import { UsuarioAdminGuard } from './usuario-admin.guard';

describe('UsuarioAdminGuard', () => {
  let guard: UsuarioAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
