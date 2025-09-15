import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import * as XLSX from 'xlsx';

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

    constructor(
        private Sweetalert2Service: Sweetalert2Service,
        private fb: FormBuilder,
        private firebaseService: FirebaseService
    ) {}
    ngOnInit(): void {
        this.inirFotm();
    }

    public guardar(): void {
        const form = this.form.getRawValue();

        // convocatoria: ['', [Validators.required]],
        //       vigencia: ['', [Validators.required]],
        //       centroFormacion: ['', [Validators.required]],
        //       usuario: ['', [Validators.required]],
        //       estado: [true, [Validators.required]],

        const payload = {
            convocatoria: form.convocatoria,
            vigencia: form.vigencia,
            centroFormacion: form.centroFormacion,
            dataConcocatoria: this.data,
            estado: form.estado,
        };

        console.log(payload);

        this.firebaseService.createConvocatoria(payload).subscribe({
            next: (resp) => {
                console.log(resp);
            },
            error: (err) => {
                console.log(err);
            },
        });
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

    public inirFotm(): void {
        this.form = this.fb.group({
            convocatoria: ['', [Validators.required]],
            vigencia: ['', [Validators.required]],
            centroFormacion: ['', [Validators.required]],
            usuario: ['', [Validators.required]],
            estado: [true, [Validators.required]],
        });
    }
}
