import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSeguridadComponent } from './stock-seguridad.component';

describe('StockSeguridadComponent', () => {
  let component: StockSeguridadComponent;
  let fixture: ComponentFixture<StockSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSeguridadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
