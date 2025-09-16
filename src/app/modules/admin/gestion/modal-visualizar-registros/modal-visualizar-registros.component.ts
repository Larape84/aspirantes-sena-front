import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';

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

    public dataSource = [];

    constructor(
        private _dialoRef: DialogRef<ModalVisualizarRegistrosComponent>,
        @Inject(MAT_DIALOG_DATA) public coleccion
    ) {}

    ngOnInit(): void {
        this.dataSource = this.coleccion.resp;
    }

    public ceerar(): void {
        this._dialoRef.close();
    }
}
