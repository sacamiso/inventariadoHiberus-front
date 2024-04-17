import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionEditComponent } from './asignacion-edit.component';

describe('AsignacionEditComponent', () => {
  let component: AsignacionEditComponent;
  let fixture: ComponentFixture<AsignacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
