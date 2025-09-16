import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { MatDrawer } from '@angular/material/sidenav';
import { delay, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { UserServicesService } from 'app/core/services/user-services.service';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppSettingsService } from 'app/core/app-config/app-settings.service';
import { ErrorService } from 'app/core/services/error.service';
import {
    ValidarNumeros,
    ValidarSoloLetrasConEspacio,
    ValidatorPasswordMatch,
} from 'app/shared/Validators/input.Validator';
import { FirebaseService } from 'app/core/services/services-firebase.service';

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
    standalone: true,
    imports: [SharedModuleModule],
})
export class UsuarioComponent implements OnDestroy, AfterViewInit {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'account';
    accountForm: FormGroup;
    public user = null;
    public fomrPassword: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public cargos = [
        'Aseador(a) G10',
        'Instructor G20',
        'Conductor G10',
        'Tecnico G02',
        'Secretaria G02',
        'Trabajador de Campo G10',
        'Profesional G02',
        'Profesional G04',
        'Auxiliar G01',
        'Profesional G01',
        'Oficial Mantto Gral.G10',
        'Profesional G06',
        'Instructor G18',
        'Instructor G19',
        'Operario Mtto Gral.G10',
        'Instructor G12',
        'Profesional G08',
        'Instructor G17',
        'Instructor G11',
        'Instructor G13',
        'Instructor G14',
        'Instructor G10',
        'Profesional G03',
        'Subdirector de Centro G02',
        'Instructor G16',
        'Instructor G15',
        'Secretaria G03',
        'Profesional G09',
        'Aprendiz Sena',
        'Aseador(a) G04',
        'Instructor G09',
        'Instructor G07',
        'Oficinista G02',
        'Profesional G10',
        'Tecnico G03',
        'Tecnico G01',
        'Auxiliar G02',
    ];

    public centros = [
        'CENTRO INDUSTRIAL Y DE AVIACION',
        'CENTRO NACIONAL COLOMBO ALEMAN',
    ];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private fb: FormBuilder,
        private _inicioSesionService: InicioSesionService,
        private _sweetAlertService: Sweetalert2Service,
        private _userService: UserServicesService,
        private _firebase: FirebaseService,
        public errorService: ErrorService
    ) {}
    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    public initFomrPass(): void {
        this.fomrPassword = this.fb.group(
            {
                pass: ['', [Validators.required]],
                newPass: ['', [Validators.required, Validators.minLength(4)]],
                repeatPass: ['', [Validators.required]],
            },
            { validator: ValidatorPasswordMatch('newPass', 'repeatPass') }
        );
    }

    ngOnInit(): void {
        this.initUser();
        this.initFomrPass();
        // Setup available panels
        this.panels = [
            {
                id: 'account',
                icon: 'heroicons_outline:user-circle',
                title: 'Mi perfil',
                description: 'Administra la información básica de tu perfil.',
            },
            {
                id: 'security',
                icon: 'heroicons_outline:lock-closed',
                title: 'Seguridad',
                description: 'Administra la seguridad de tu perfil.',
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    public initUser(): void {
        this.user = this._inicioSesionService.obtenerUsuario();

        const profile = this.user.permisos[0].access.admin
            ? 'Administrador'
            : 'Gestion y seguimiento';

        this.accountForm = this.fb.group({
            nombres: [`${this.user.nombres}`, []],
            profile: [profile, [Validators.required]],
            identification: [this.user.cedula, [Validators.required]],
            centro: [this.user.centroFormacion, [Validators.required]],
        });

        const disabled = ['nombres', 'identification', 'centro', 'profile'];

        disabled.forEach((control) => {
            this.accountForm.controls[control].disable();
            this.accountForm.controls[control].updateValueAndValidity();
        });
    }

    actualizarDatos(): void {
        this._sweetAlertService.startLoading({});
        const { id } = this.user;
        const payload = this.accountForm.value;

        this._firebase
            .updateDocumentComplet('usuarios', id, {
                centroCosto: payload.centro,
                cargo: payload.profile,
            })
            .subscribe({
                next: (resp: any) => {
                    this._inicioSesionService.asignarUsuarioModulos(resp);

                    this._sweetAlertService
                        .alertSuccessWithConfirm()
                        .then(() => {
                            this.initUser();
                            this._changeDetectorRef.detectChanges();
                        });
                },
                error: () => {},
            });

        //
    }

    public actualizarContrasena(): void {
        const data = this.fomrPassword.value;

        if (String(this.user.contrasena) !== String(data.pass)) {
            this._sweetAlertService.alertInfo({
                info: 'Su contraseña actual no coincide, por favor validar',
            });
            return;
        }

        this.user['contrasena'] = String(data.pass);
        this.user['apellido'] = String(data.pass);

        const updatedData: any = { contrasena: String(data.newPass) };

        this._sweetAlertService.startLoading({});

        this._firebase
            .updateDocumentComplet(
                'usuarios',
                String(this.user.id),
                updatedData
            )
            .subscribe({
                next: (resp) => {
                    this.user = resp;
                    this._sweetAlertService
                        .alertSuccessWithConfirm()
                        .then(() => {
                            this.initFomrPass();
                        });
                },
                error: (e: HttpErrorResponse) => {
                    this._sweetAlertService.alertError(e.message);
                },
            });
    }

    public regresarControl(form: FormGroup, control: string): FormControl {
        return form.controls[control] as FormControl;
    }
}
