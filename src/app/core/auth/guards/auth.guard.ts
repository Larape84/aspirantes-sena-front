import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';
import { of, skip, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const _iniicioSesionService = inject(InicioSesionService);

    const user = _iniicioSesionService.obtenerUsuario();

    const [permisosUsuario] = user.permisos;
    console.log(state.url, permisosUsuario);

    if (state.url === '/usuarios') {
        if (!!permisosUsuario.access.admin) {
            return true;
        } else {
            router.navigateByUrl('/app');
            return false;
        }
    } else {
        if (!!permisosUsuario.access.usuario) {
            return true;
        } else {
            router.navigateByUrl('/app');
            return false;
        }
    }
};
