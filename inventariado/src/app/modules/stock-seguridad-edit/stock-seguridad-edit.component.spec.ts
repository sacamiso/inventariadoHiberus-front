import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSeguridadEditComponent } from './stock-seguridad-edit.component';

describe('StockSeguridadEditComponent', () => {
  let component: StockSeguridadEditComponent;
  let fixture: ComponentFixture<StockSeguridadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSeguridadEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSeguridadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
