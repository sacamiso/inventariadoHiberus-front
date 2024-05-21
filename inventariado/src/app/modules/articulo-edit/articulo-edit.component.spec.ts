import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloEditComponent } from './articulo-edit.component';

describe('ArticuloEditComponent', () => {
  let component: ArticuloEditComponent;
  let fixture: ComponentFixture<ArticuloEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticuloEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticuloEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
