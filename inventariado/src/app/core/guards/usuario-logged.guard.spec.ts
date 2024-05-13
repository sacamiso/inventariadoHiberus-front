import { TestBed } from '@angular/core/testing';

import { UsuarioLoggedGuard } from './usuario-logged.guard';

describe('UsuarioLoggedGuard', () => {
  let guard: UsuarioLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
