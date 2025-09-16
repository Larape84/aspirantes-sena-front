import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { ModalAgregarRegistrosComponent } from './modal-agregar-registros/modal-agregar-registros.component';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalVisualizarRegistrosComponent } from './modal-visualizar-registros/modal-visualizar-registros.component';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';
import { FinalizarSessionService } from 'app/core/services/finalizar-session.service';

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.component.html',
    styleUrls: ['./gestion.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class GestionComponent implements OnInit {
    @ViewChild(MatPaginator) paginador: MatPaginator;

    public dataSource = new MatTableDataSource([]);
    public displayedColumns = [
        'convocatoria',
        'vigencia',
        'centroFormacion',
        'usuario',
        'fechaCreacion',
        'estado',
        'registros',
    ];

    public user = null;

    public viewMode = 'XLarge';
    public _iniicioSesionService = inject(InicioSesionService);

    constructor(
        private _utilService: UtilityService,
        private _dialogService: MatDialog,
        private _sweetalertService: Sweetalert2Service,
        private _fireService: FirebaseService,
        private _finalizaSecion: FinalizarSessionService
    ) {}

    public obtenerUsuario(): void {
        this.user = this._iniicioSesionService.obtenerUsuario();
    }

    ngOnInit(): void {
        this._finalizaSecion.resetSessionTimer();
        this._utilService.getWidth().subscribe({
            next: (resp) => {
                this.viewMode = resp;
            },
        });

        this.listarUsuarios();
        this.obtenerUsuario();
    }

    public openModal(): void {
        this._dialogService
            .open(ModalAgregarRegistrosComponent, {
                panelClass: ['w-[40rem]'],
            })
            .afterClosed()
            .subscribe((res) => {
                if (!!res) {
                    this.listarUsuarios(false);
                }
            });
    }

    public descargarData(): void {
        const data = this.dataSource.data.map((item) => {
            const { id, token, ...rest } = item;
            return rest;
        });

        const reporte = `Reporte de convocatorias registradas`;
        this._utilService.exportAsExcelFile(data, reporte);
    }

    public listarUsuarios(loading = true): void {
        if (loading) {
            this._sweetalertService.startLoading({});
            new MatTableDataSource([]);
        }

        this._fireService.getCollection('convocatorias').subscribe({
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

    public filtrar(text: string): void {
        this.dataSource.filter = text;
    }

    public cambiarEstadoDependencia(item: any): void {
        this._sweetalertService.startLoading({});

        this._fireService
            .updateDocument('convocatorias', item.id, { estado: item.estado })
            .subscribe({
                next: (resp) => {
                    this._sweetalertService.alertSuccess();
                },
                error: (e) => {
                    this._sweetalertService.alertError(e.message);
                    this.listarUsuarios();
                },
            });
    }

    public visualizarRegistros(element: any): void {
        this._sweetalertService.startLoading({});

        const coleccion = `convocatorias/${element.id}/dataConvocatoria`;

        console.log(coleccion);

        this._fireService.getColectionsRegister(coleccion).subscribe({
            next: (resp) => {
                this._sweetalertService.stopLoading();

                this._dialogService.open(ModalVisualizarRegistrosComponent, {
                    data: { resp, element },
                });
            },
            error: (e: HttpErrorResponse) => {
                console.log(e);
                this._sweetalertService.alertError(e.message);
            },
        });
    }
}
