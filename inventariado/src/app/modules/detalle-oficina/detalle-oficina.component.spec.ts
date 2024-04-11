import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOficinaComponent } from './detalle-oficina.component';

describe('DetalleOficinaComponent', () => {
  let component: DetalleOficinaComponent;
  let fixture: ComponentFixture<DetalleOficinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleOficinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
