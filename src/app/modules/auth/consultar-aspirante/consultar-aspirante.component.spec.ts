import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarAspiranteComponent } from './consultar-aspirante.component';

describe('ConsultarAspiranteComponent', () => {
  let component: ConsultarAspiranteComponent;
  let fixture: ComponentFixture<ConsultarAspiranteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultarAspiranteComponent]
    });
    fixture = TestBed.createComponent(ConsultarAspiranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
