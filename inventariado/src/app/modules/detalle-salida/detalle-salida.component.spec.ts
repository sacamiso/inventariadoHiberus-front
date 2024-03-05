import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSalidaComponent } from './detalle-salida.component';

describe('DetalleSalidaComponent', () => {
  let component: DetalleSalidaComponent;
  let fixture: ComponentFixture<DetalleSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
