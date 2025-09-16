import { DateTime } from 'luxon';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { FinalizarSessionService } from 'app/core/services/finalizar-session.service';

@Component({
    selector: 'app-registros-realizados',
    templateUrl: './registros-realizados.component.html',
    styleUrls: ['./registros-realizados.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
    encapsulation: ViewEncapsulation.None,
})
export class RegistrosRealizadosComponent implements OnInit {
    @ViewChild(MatPaginator) paginador: MatPaginator;

    public max = new Date();

    public usuarios = [];

    public viewMode = 'XLarge';
    dataSource = new MatTableDataSource([]);
    public displayedColumns = [
        'fecha_hora',
        'tipo_comida',
        'info_pedidor',
        'cargo_pedidor',
        'info_Autizado',
        'cargoAutorizado',
    ];
    public formfechas: FormGroup = new FormGroup({});

    constructor(
        private _sweetalertService: Sweetalert2Service,
        private _fireService: FirebaseService,
        private _utilService: UtilityService,
        private _fb: FormBuilder,
        private _finalizaSecion: FinalizarSessionService
    ) {}

    ngOnInit(): void {
        this._finalizaSecion.resetSessionTimer();

        this._utilService.getWidth().subscribe({
            next: (resp) => {
                this.viewMode = resp;
            },
        });

        this.listar_usuarios();

        this.formfechas = this._fb.group({
            fechaInicio: ['', [Validators.required]],
            fechaFinal: ['', [Validators.required]],
        });
    }

    public listarregistros(): void {
        this._sweetalertService.startLoading({});

        this.dataSource = new MatTableDataSource([]);

        const { fechaInicio, fechaFinal } = this.formfechas.value;

        const min = Number(DateTime.fromISO(fechaInicio).toFormat('yyyyMMdd'));
        const max = Number(DateTime.fromISO(fechaFinal).toFormat('yyyyMMdd'));

        this._fireService
            .getDocumentsByRange('registros', 'fechaNumero', min, max)
            .subscribe({
                next: (resp) => {
                    const data = resp.map((item) => {
                        const [cedulaPedidor] = String(
                            item.idSocicitante
                        ).split('-');
                        const userpedido = this.usuarios.find(
                            (value) => value.id === cedulaPedidor
                        );
                        const nombre_apellidoPedidor = `${userpedido.nombre} ${userpedido.apellido}`;
                        const cargo_Pedidor = userpedido.cargo;
                        const centro_Pedidor = userpedido.centroCosto;
                        const { centroCosto } = this.usuarios.find(
                            (value) => value.id === item.idAutorizado
                        );

                        const value = {
                            fecha: item.fecha,
                            hora: item.hora,
                            comida: item.idSocicitante.includes('-1')
                                ? 'Desayuno'
                                : 'Almuerzo',
                            cedulaPedidor,
                            nombre_apellidoPedidor,
                            cargo_Pedidor,
                            centro_Pedidor,
                            cedula_autoriza: item.idAutorizado,
                            nombre_apellidoAutoriza: `${item.nombreAutizado} ${item.apellidoAutorizado}`,
                            cargo_autoriza: item.cargoAutorizado,
                            centro_autoriza: centroCosto,
                        };
                        return value;
                    });

                    this.dataSource = new MatTableDataSource(data || []);
                    this.paginador.pageSize = this.dataSource.data.length ?? 50;
                    this.dataSource.paginator = this.paginador;
                    this._sweetalertService.stopLoading();
                },
                error: (e) => {},
            });
    }

    public listar_usuarios(): void {
        this._fireService.getCollection('usuarios').subscribe({
            next: (resp) => {
                this.usuarios = resp;
            },
            error: () => {
                this.usuarios = [];
            },
        });
    }

    public descargarData(): void {
        if (!this.dataSource.data.length) {
            this._sweetalertService.alertInfo({
                info: 'Lo sentimos, no se encontraron datos para descargar el reporte',
            });
            return;
        }

        const data = this.dataSource.data.map((item) => {
            const value = {
                Fecha: item.fecha,
                Hora: item.hora,
                Comida: item.comida,
                'Cedula del funcionario': item.cedulaPedidor,
                Funcionario: item.nombre_apellidoPedidor,
                'Cargo del funcionario': item.cargo_Pedidor,
                'Centro de formación': item.centro_Pedidor,
                'Cedula restaurant': item.cedula_autoriza,
                'Nombre del chef ': item.nombre_apellidoAutoriza,
                'Cargo del chef': item.cargo_autoriza,
                'centro de costo del chef': item.centro_autoriza,
            };

            return value;
        });
        // const hoy = DateTime.local().toFormat('dd-MM-yyyy HH mm');
        const reporte = `Reporte de registros de almuerzos registrados`;
        this._utilService.exportAsExcelFile(data, reporte);
    }

    public filtrar(text: string): void {
        this.dataSource.filter = text;
    }
}
