import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevoUsuarioComponent } from './modal-nuevo-usuario.component';

describe('ModalNuevoUsuarioComponent', () => {
  let component: ModalNuevoUsuarioComponent;
  let fixture: ComponentFixture<ModalNuevoUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNuevoUsuarioComponent]
    });
    fixture = TestBed.createComponent(ModalNuevoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
