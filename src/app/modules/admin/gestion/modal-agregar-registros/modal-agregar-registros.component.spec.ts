import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarRegistrosComponent } from './modal-agregar-registros.component';

describe('ModalAgregarRegistrosComponent', () => {
  let component: ModalAgregarRegistrosComponent;
  let fixture: ComponentFixture<ModalAgregarRegistrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAgregarRegistrosComponent]
    });
    fixture = TestBed.createComponent(ModalAgregarRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
