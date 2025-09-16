import { Component, OnInit } from '@angular/core';
import { FinalizarSessionService } from 'app/core/services/finalizar-session.service';
import { UtilityService } from 'app/core/services/utility.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class InicioComponent implements OnInit {
    public screen: string = '';

    constructor(
        private _utilService: UtilityService,
        private _finalizaSecion: FinalizarSessionService
    ) {}

    ngOnInit(): void {
        this._utilService.getWidth().subscribe({
            next: (res) => {
                this.screen = res;
            },
        });
        this._finalizaSecion.startSessionTimer();
    }
}
