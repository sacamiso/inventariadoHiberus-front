import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOficinaPublicComponent } from './detalle-oficina-public.component';

describe('DetalleOficinaPublicComponent', () => {
  let component: DetalleOficinaPublicComponent;
  let fixture: ComponentFixture<DetalleOficinaPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleOficinaPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleOficinaPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
