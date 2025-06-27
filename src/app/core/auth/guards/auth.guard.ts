import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';
import { of, skip, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) =>
{
    const router: Router = inject(Router);
    const _iniicioSesionService = inject(InicioSesionService)

     const user = _iniicioSesionService.obtenerUsuario()



     const [permisosUsuario ]= user.permisos
     console.log(state.url, permisosUsuario)


        if(state.url === '/codigoQr'){

            if(!!permisosUsuario.access.usuario){
                return true
            }else{
                router.navigateByUrl('/app')
                return false
            }
        } else if(state.url === '/usuarios'){

            if(!!permisosUsuario.access.admin){
                return true
            }else{
                router.navigateByUrl('/app')
                return false
            }



        }else if(state.url === '/scanQr'){

            if(!!permisosUsuario.access.gestor){
                return true
            }else{
                router.navigateByUrl('/app')
                return false
            }


        }else if(state.url === '/registros'){
            if(!!permisosUsuario.access.admin){
                return true
            }else{
                router.navigateByUrl('/app')
                return false
            }












     }





    // return inject(AuthService).consultarToken().pipe(
    //     switchMap((authenticated) =>
    //     {
    //         // If the user is not authenticated...
    //         if ( !authenticated )
    //         {
    //             // Redirect to the sign-in page with a redirectUrl param
    //             const redirectURL = state.url === '/sign-out' ? '' : `redirectURL=${state.url}`;
    //             const urlTree = router.parseUrl(`sign-in?${redirectURL}`);

    //             return of(urlTree);
    //         }

    //         // Allow the access
    //         return of(true);
    //     }),
    // );
};
