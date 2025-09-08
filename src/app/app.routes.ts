import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    {
        path: 'login',
        // canActivate: [NoAuthGuard],
        // canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },

            { path: '**', redirectTo: 'sign-in' },
        ],
    },
    { path: '', pathMatch: 'full', redirectTo: 'login' },

    {
        path: 'app',

        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },

        children: [
            {
                path: '',
                loadChildren: () =>
                    import('app/modules/admin/inicio/inicio.routes'),
            },
            {
                path: 'usuario',
                loadChildren: () =>
                    import('app/modules/admin/usuario/usuario.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivateChild: [AuthGuard],
        runGuardsAndResolvers: 'always',
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },

        children: [
            {
                path: 'usuarios',
                loadChildren: () =>
                    import(
                        'app/modules/admin/panelControl/panel-control.routes'
                    ),
            },
            {
                path: 'gestion',
                loadChildren: () =>
                    import('app/modules/admin/gestion/gestion.routes'),
            },

            {
                path: 'registros',
                loadChildren: () =>
                    import(
                        'app/modules/admin/registrosRealizados/registrosRealizados.routes'
                    ),
            },
        ],
    },

    { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
