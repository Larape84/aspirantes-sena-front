import { Component, OnInit } from '@angular/core';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { A11yModule } from '@angular/cdk/a11y';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { InicioSesionService } from '../sign-in/inicio-sesion.service';
import { FinalizarSessionService } from 'app/core/services/finalizar-session.service';
import { dataOffline } from './data';

@Component({
    selector: 'app-consultar-aspirante',
    templateUrl: './consultar-aspirante.component.html',
    styleUrls: ['./consultar-aspirante.component.scss'],
    standalone: true,
    imports: [SharedModuleModule, A11yModule],
})
export class ConsultarAspiranteComponent implements OnInit {
    public formsearch: FormGroup = new FormGroup({});

    public dataConsulta: any[] = [];

    constructor(
        private form: FormBuilder,
        private fireBaseservice: FirebaseService,
        private _sweetAlertService: Sweetalert2Service,
        private _inicioSesion: InicioSesionService,
        private _finalizaSecion: FinalizarSessionService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this._inicioSesion.eliminarUsuario();
        this._finalizaSecion.resetSessionTimer();
    }

    private initForm(): void {
        this.formsearch = this.form.group({
            DOCUMENTO: ['', [Validators.required]],
            TIPO_DOCUMENTO: ['', [Validators.required]],
        });
    }

    public borrarConsulta(): void {
        this.dataConsulta = [];
        this.initForm();
    }

    public consultarRegistro(): void {
        this._sweetAlertService.startLoading({});

        const payload = this.formsearch.getRawValue();
        this.fireBaseservice.consultarResitro(payload).subscribe({
            next: (resp) => {
                this.dataConsulta = resp?.resultados || [];
                // this.dataConsulta = dataOffline || [];

                if (this.dataConsulta.length === 0) {
                    this._sweetAlertService.alertInfo({});
                    this.initForm();
                }

                this._sweetAlertService.stopLoading();
            },
            error: (e: HttpErrorResponse) => {
                // this.dataConsulta = dataOffline || [];
                // this._sweetAlertService.stopLoading();
                this._sweetAlertService.alertError(e.message);
            },
        });
    }
}
