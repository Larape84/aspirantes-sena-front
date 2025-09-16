import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import * as XLSX from 'xlsx';
import { ErrorService } from '../../../../core/services/error.service';

@Component({
    selector: 'app-modal-agregar-registros',
    templateUrl: './modal-agregar-registros.component.html',
    styleUrls: ['./modal-agregar-registros.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class ModalAgregarRegistrosComponent implements OnInit {
    data: any[] = [];
    name: string = '';
    centroFormacion = [
        'Colombo aleman',
        'Industrial y de aviacion',
        'Comercio y servicios',
        'Cedagro',
        'Despacho regional',
    ];

    public form: FormGroup = new FormGroup({});
    public years = [];

    public _iniicioSesionService = inject(InicioSesionService);
    public user = null;

    constructor(
        private Sweetalert2Service: Sweetalert2Service,
        private fb: FormBuilder,
        private firebaseService: FirebaseService,
        private dialogRef: MatDialogRef<ModalAgregarRegistrosComponent>,
        public ErrorService: ErrorService
    ) {}
    ngOnInit(): void {
        this.obtenerUsuario();
        this.inirFotm();
        this.years = this.getYearsDescFrom2025();
    }

    public getYearsDescFrom2025(): string[] {
        const currentYear = new Date().getFullYear();
        const years: string[] = [];

        for (let year = currentYear; year >= 2025; year--) {
            years.push(year.toString());
        }

        return years;
    }

    public obtenerUsuario(): void {
        this.user = this._iniicioSesionService.obtenerUsuario();
    }

    public guardar(): void {
        const callback = () => {
            const form = this.form.getRawValue();

            this.Sweetalert2Service.startLoading({});

            const payload: any = {
                convocatoria: form.convocatoria,
                vigencia: form.vigencia,
                centroFormacion: form.centroFormacion,
                dataConvocatoria: this.data,
                estado: form.estado,
                user: this.user,
                fecha: new Date(),
                registros: this.data.length,
            };

            this.firebaseService.createConvocatoria(payload).subscribe({
                next: (resp: any) => {
                    this.Sweetalert2Service.alertSuccess().then(() => {
                        this.dialogRef.close(true);
                    });
                },
                error: (err: HttpErrorResponse) => {
                    this.Sweetalert2Service.alertError(err.message);
                },
            });
        };

        this.Sweetalert2Service.alertConfirmation(callback);
    }

    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (!input.files || input.files.length === 0) {
            return;
        }

        const file = input.files[0];

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            this.Sweetalert2Service.alertInfo({
                info: 'Solo se permiten archivos de Excel (.xlsx, .xls)',
            });

            return;
        }

        this.Sweetalert2Service.startLoading({});

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const binaryData = e.target.result;

            const workbook = XLSX.read(binaryData, { type: 'binary' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            this.data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

            this.name = file.name;

            console.log('Datos Excel:', this.data);
            this.Sweetalert2Service.stopLoading();
        };

        reader.readAsBinaryString(file);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files) {
            this.onFileChange(event);
        }
    }

    public borrarArchivo(): void {
        this.data = [];
        this.name = '';
    }

    public ceerar(): void {
        this.dialogRef.close();
    }

    public inirFotm(): void {
        this.form = this.fb.group({
            convocatoria: ['', [Validators.required, Validators.minLength(5)]],
            vigencia: ['', [Validators.required]],
            centroFormacion: ['', [Validators.required]],
            estado: [true, [Validators.required]],
        });
    }
}
