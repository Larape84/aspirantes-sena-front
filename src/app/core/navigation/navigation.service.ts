import { compact } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppSettingsService } from '../app-config/app-settings.service';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<Navigation | any> =
        new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _appSettings: AppSettingsService,
        private _inicioSesion: InicioSesionService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */

    public filtrarCompact(
        menuData: any,
        condicion1: boolean,
        condicion2: boolean,
        condicion3: boolean
    ): any {
        const idsPermitidos = new Set<string>();

        if (condicion1) {
            idsPermitidos.add('anexarDocumento');
        }

        if (condicion3) {
            idsPermitidos.add('usuarioCreado');
            idsPermitidos.add('anexarDocumento');
        }

        return menuData.compact.filter((item) => idsPermitidos.has(item.id));
    }

    get(): Observable<any> {
        return this._httpClient
            .get<Navigation | any>('api/common/navigation')
            .pipe(
                tap((navigation) => {
                    const usuario = this._inicioSesion.obtenerUsuario();
                    const [permisosUsuario] = usuario.permisos;
                    const compact = this.filtrarCompact(
                        navigation,
                        permisosUsuario.access.usuario,
                        permisosUsuario.access.gestor,
                        permisosUsuario.access.admin
                    );
                    navigation.compact = compact;
                    this._navigation.next(navigation);
                })
            );
    }
}
