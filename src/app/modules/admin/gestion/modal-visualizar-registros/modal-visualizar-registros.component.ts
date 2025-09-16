import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-modal-visualizar-registros',
    templateUrl: './modal-visualizar-registros.component.html',
    styleUrls: ['./modal-visualizar-registros.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class ModalVisualizarRegistrosComponent implements OnInit {
    public displayedColumns = [
        'NOMBRES',
        'CORREO_E',
        'NOMBRE SED',
        'NIVEL FORMACION',
        'ESTADO',
        'DESCRIPCION',
    ];

    public dataSource = new MatTableDataSource([]);

    constructor(
        private _dialoRef: DialogRef<ModalVisualizarRegistrosComponent>,
        @Inject(MAT_DIALOG_DATA) public coleccion,
        private _utilService: UtilityService
    ) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.coleccion.resp || []);
    }

    public filtrar(text: string): void {
        this.dataSource.filter = text;
    }

    public descargar(): void {
        const data = this.dataSource.data.map((item) => {
            const { id, token, ...rest } = item;
            return rest;
        });

        const reporte = `Reporte de aspirantes registrados en la convocatoria`;
        this._utilService.exportAsExcelFile(data, reporte);
    }

    public ceerar(): void {
        this._dialoRef.close();
    }
}
