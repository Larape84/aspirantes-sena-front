import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InicioSesionService } from './inicio-sesion.service';

export const AuthGuardChildren: CanActivateChildFn = (route, state) => {
    const _router = inject(Router);
    const usuarioSesion = inject(InicioSesionService);
    try {
        const rutaActual = state.url;
        const permisosBase64 = sessionStorage?.getItem(btoa('userModules'));
        if (!permisosBase64) {
            _router.navigateByUrl('/app');
            return false;
        }

        const permisos = JSON?.parse(atob(permisosBase64)) ?? [];
        const tienePermiso =
            permisos.filter((item) => item.link === rutaActual).length > 0;
        if (!tienePermiso) {
            _router.navigateByUrl('/app');
            return false;
        }
        return true;
    } catch (error) {
        usuarioSesion.eliminarUsuario();
        Swal.fire({
            allowOutsideClick: false,
            title: 'Error',
            text: 'Por favor iniciar sesión',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            customClass: {
                actions: 'flex-row-reverse gap-2',
                confirmButton: 'rounded-full w-26 ring-0',
            },
        }).then(() => {
            _router.navigateByUrl('/login/sign-in');
        });

        return false;
    }
};
