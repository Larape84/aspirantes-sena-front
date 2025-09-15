import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { ModalAgregarRegistrosComponent } from './modal-agregar-registros/modal-agregar-registros.component';

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.component.html',
    styleUrls: ['./gestion.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class GestionComponent implements OnInit {
    public dataSource = [];
    public displayedColumns = [
        'documento',
        'nombre',
        'apellido',
        'cargo',
        'centro',
        'activo',
        'usuario',
        'gestor',
        'admin',
    ];

    public viewMode = 'XLarge';

    constructor(
        private _utilService: UtilityService,
        private _dialogService: MatDialog
    ) {}

    ngOnInit(): void {
        this._utilService.getWidth().subscribe({
            next: (resp) => {
                this.viewMode = resp;
            },
        });
    }

    public openModal(): void {
        this._dialogService.open(ModalAgregarRegistrosComponent, {
            panelClass: ['w-[40rem]'],
        });
    }

    public descargarData(): void {}

    public listarUsuarios(): void {}

    public filtrar(text: string): void {}

    public cambiarEstadoDependencia(item: any): void {}
}
