import { TestBed } from '@angular/core/testing';

import { EventoAvisoService } from './evento-aviso.service';

describe('EventoAvisoService', () => {
  let service: EventoAvisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventoAvisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
