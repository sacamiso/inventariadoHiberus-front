import { TestBed } from '@angular/core/testing';

import { ArtuculoService } from './articulo.service';

describe('ArtuculoService', () => {
  let service: ArtuculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtuculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
