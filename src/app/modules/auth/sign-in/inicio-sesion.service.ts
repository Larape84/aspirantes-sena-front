import { filter } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class InicioSesionService {
    constructor(private _router: Router) {}

    public asignarUsuarioModulos(usuario: any): void {
        const usuarioBtao = JSON.stringify(usuario);
        sessionStorage.setItem(btoa('userToken'), btoa(usuarioBtao));
    }

    public eliminarUsuario(): void {
        sessionStorage.removeItem(btoa('userModules'));
        sessionStorage.removeItem(btoa('userToken'));
        localStorage.removeItem('accessToken');
    }

    public obtenerUsuario(): any {
        try {
            const userBase64 = sessionStorage.getItem(btoa('userToken'));
            const userLogin = JSON.parse(atob(userBase64));
            return userLogin;
        } catch (error) {
            this.eliminarUsuario();
            this._router.navigateByUrl('/login/sign-in');
        }
    }

    public isLoggedIn(): boolean {
        let errorPermisos = true;

        try {
            const permisosBase64 = sessionStorage.getItem(btoa('userModules'));
            const permisos = JSON.parse(atob(permisosBase64));
            if (!!permisos) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            errorPermisos = false;
        }
        return errorPermisos;
    }

    public obtenerAccesoCrear(): boolean {
        const permisos = this.obtenerPermisos();
        const rutaActual = permisos.find(
            (item) => item.link === this._router.url
        );
        return rutaActual.access.create ?? false;
    }

    public obtenerAccesoEditar(): boolean {
        const permisos = this.obtenerPermisos();
        const rutaActual = permisos.find(
            (item) => item.link === this._router.url
        );
        return rutaActual.access.update ?? false;
    }

    public obtenerAccesoDelete(): boolean {
        const permisos = this.obtenerPermisos();
        const rutaActual = permisos.find(
            (item) => item.link === this._router.url
        );
        return rutaActual.access.delete ?? false;
    }

    public obtenerPermisosModulo(): any {
        const permisos = {
            crear: this.obtenerAccesoCrear(),
            editar: this.obtenerAccesoEditar(),
            eliminar: this.obtenerAccesoDelete(),
        };
        return permisos;
    }

    public obtenerPermisos(): any {
        try {
            const permisosBase64 = sessionStorage.getItem(btoa('userModules'));
            const permisos = JSON.parse(atob(permisosBase64)) ?? [];
            return permisos;
        } catch (error) {
            this.eliminarUsuario();
            this._router.navigateByUrl('/login/sign-in');
        }
    }

    //   public validarPermiso(): void{
    //    const rutaActual = this._router.url;
    //    const permisosBase64 =  sessionStorage.getItem(btoa('userModules'))
    //    const permisos = JSON.parse(atob(permisosBase64)) ?? []
    //    if(!permisos.filter(item=>item.link === rutaActual).length){
    //     this._router.navigateByUrl('/app')
    //    }

    //   }
}
