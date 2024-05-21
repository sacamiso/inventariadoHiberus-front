import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficinaEditComponent } from './oficina-edit.component';

describe('OficinaEditComponent', () => {
  let component: OficinaEditComponent;
  let fixture: ComponentFixture<OficinaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OficinaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OficinaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
