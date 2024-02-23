import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialInventarioComponent } from './historial-inventario.component';

describe('HistorialInventarioComponent', () => {
  let component: HistorialInventarioComponent;
  let fixture: ComponentFixture<HistorialInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialInventarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
