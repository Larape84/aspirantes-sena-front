import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { validarUsuarioRegistrado } from 'app/shared/Validators/input.Validator';
import { ErrorService } from '../../../../core/services/error.service';

@Component({
    selector: 'app-modal-nuevo-usuario',
    templateUrl: './modal-nuevo-usuario.component.html',
    styleUrls: ['./modal-nuevo-usuario.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class ModalNuevoUsuarioComponent implements OnInit {
    public form: FormGroup = new FormGroup({});
    centroFormacion = [
        'Colombo aleman',
        'Industrial y de aviacion',
        'Comercio y servicios',
        'Cedagro',
        'Despacho regional',
    ];

    rolFormacion = ['Gestion y seguimiento', 'Administrador'];

    constructor(
        private _dialoRef: MatDialogRef<ModalNuevoUsuarioComponent>,
        private fb: FormBuilder,
        private firebaseService: FirebaseService,
        private _sweetalertService: Sweetalert2Service,
        @Inject(MAT_DIALOG_DATA) public usuarios: any,
        public ErrorService: ErrorService
    ) {}

    ngOnInit(): void {
        this.inirFotm();
    }

    public guardar(): void {
        this._sweetalertService.startLoading({});

        const values = this.form.getRawValue();

        const payload = {
            ...values,
            permisos: [
                {
                    icon: 'heroicons_outline:user',
                    link: '/usuarios',
                    title: 'Usuarios',
                    id: 1,
                    type: 'basic',
                    access: {
                        gestor: true,
                        admin: values.rol === 'Administrador' ? true : false,
                        usuario: true,
                    },
                },
            ],
        };

        this.firebaseService
            .createDocumentWithId('usuarios', String(values.cedula), payload)
            .subscribe({
                next: (resp) => {
                    this._sweetalertService.alertSuccess().then(() => {
                        this._dialoRef.close(true);
                    });
                },
                error: (e) => {
                    this._sweetalertService.alertError(e);
                },
            });
    }

    public cerrar(): void {
        this._dialoRef.close();
    }

    public inirFotm(): void {
        this.form = this.fb.group({
            nombres: ['', [Validators.required]],
            cedula: [
                '',
                [
                    Validators.required,
                    Validators.minLength(5),
                    validarUsuarioRegistrado(this.usuarios || []),
                ],
            ],
            contrasena: ['', [Validators.minLength(5), Validators.required]],
            centroFormacion: ['', [Validators.required]],
            activo: [true, [Validators.required]],
            rol: ['', [Validators.required]],
        });
    }
}
