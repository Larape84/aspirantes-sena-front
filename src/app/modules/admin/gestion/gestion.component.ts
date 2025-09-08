import { Component } from '@angular/core';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.component.html',
    styleUrls: ['./gestion.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class GestionComponent {
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
}
