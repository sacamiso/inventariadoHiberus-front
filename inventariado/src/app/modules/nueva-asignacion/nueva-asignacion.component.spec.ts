import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaAsignacionComponent } from './nueva-asignacion.component';

describe('NuevaAsignacionComponent', () => {
  let component: NuevaAsignacionComponent;
  let fixture: ComponentFixture<NuevaAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaAsignacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
