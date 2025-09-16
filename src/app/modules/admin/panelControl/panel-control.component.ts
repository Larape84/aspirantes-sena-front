import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { DateTime } from 'luxon';
import { ModalNuevoUsuarioComponent } from './modal-nuevo-usuario/modal-nuevo-usuario.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-panel-control',
    templateUrl: './panel-control.component.html',
    styleUrls: ['./panel-control.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class PanelControlComponent implements OnInit {
    @ViewChild(MatPaginator) paginador: MatPaginator;

    public viewMode = 'XLarge';
    dataSource = new MatTableDataSource([]);
    public displayedColumns = [
        'nombre',
        'documento',
        'centro',
        'activo',
        'admin',
    ];

    constructor(
        private _sweetalertService: Sweetalert2Service,
        private _fireService: FirebaseService,
        private _utilService: UtilityService,
        private _dialogService: MatDialog
    ) {}

    ngOnInit(): void {
        this.listarUsuarios();
        this._utilService.getWidth().subscribe({
            next: (resp) => {
                this.viewMode = resp;
            },
        });
    }

    public modalusuarios(): void {}

    public openModal(): void {
        const usuariosRegistrados = [
            ...this.dataSource.data.map((item) => {
                return item.cedula;
            }),
        ];

        this._dialogService
            .open(ModalNuevoUsuarioComponent, {
                panelClass: ['w-[40rem]'],
                data: usuariosRegistrados,
            })
            .afterClosed()
            .subscribe({
                next: (res) => {
                    if (!!res) {
                        this.listarUsuarios();
                    }
                },
            });
    }

    public listarUsuarios(loading = true): void {
        if (loading) {
            this._sweetalertService.startLoading({});
            new MatTableDataSource([]);
        }

        this._fireService.getCollection('usuarios').subscribe({
            next: (resp) => {
                this.dataSource = new MatTableDataSource(resp || []);
                this.paginador.pageSize = this.dataSource.data.length ?? 50;
                this.dataSource.paginator = this.paginador;

                console.log(resp);
                if (loading) {
                    this._sweetalertService.stopLoading();
                }
            },
        });
    }

    public descargarData(): void {
        const hoy = DateTime.local().toFormat('dd-MM-yyyy HH mm');
        const reporte = `Reporte de usuarios registrados a corte ${hoy}`;
        this._utilService.exportAsExcelFile(this.dataSource.data, reporte);
    }

    public filtrar(value: string): void {
        this.dataSource.filter = value;
    }

    public cambiarEstadoDependencia(usuario): void {
        this._sweetalertService.startLoading({});

        this._fireService
            .updateDocument('usuarios', usuario.id, usuario)
            .subscribe({
                next: () => {
                    this._sweetalertService.alertSuccess();
                },
            });
    }
}
