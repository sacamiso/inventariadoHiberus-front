import { TestBed } from '@angular/core/testing';

import { StockSeguridadService } from './stock-seguridad.service';

describe('StockSeguridadService', () => {
  let service: StockSeguridadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockSeguridadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
