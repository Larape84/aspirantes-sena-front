import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVisualizarRegistrosComponent } from './modal-visualizar-registros.component';

describe('ModalVisualizarRegistrosComponent', () => {
  let component: ModalVisualizarRegistrosComponent;
  let fixture: ComponentFixture<ModalVisualizarRegistrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVisualizarRegistrosComponent]
    });
    fixture = TestBed.createComponent(ModalVisualizarRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
