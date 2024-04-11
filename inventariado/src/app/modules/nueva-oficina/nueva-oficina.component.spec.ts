import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOficinaComponent } from './nueva-oficina.component';

describe('NuevaOficinaComponent', () => {
  let component: NuevaOficinaComponent;
  let fixture: ComponentFixture<NuevaOficinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaOficinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaOficinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
