import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideFuse } from '@fuse';
import { appRoutes } from 'app/app.routes';
import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { provideTransloco } from 'app/core/transloco/transloco.provider';
import { mockApiServices } from 'app/mock-api';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'environments/environment';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';

const MY_LUXON_FORMATS = {
    parse: {
        dateInput: 'dd/MM/yyyy', // Formato de entrada
    },
    display: {
        dateInput: 'dd/MM/yyyy', // Formato en el input
        monthYearLabel: 'MMMM yyyy',
        dateA11yLabel: 'DD',
        monthYearA11yLabel: 'MMMM yyyy',
    },
};

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideFirestore(() => getFirestore())
        ),
        provideAnimations(),
        provideHttpClient(),
        provideEnvironmentNgxMask(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),

        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                    // dateInput: 'DD/MM/YYYY', // Formato de entrada
                },
                display: {
                    // dateInput         : 'DDD',
                    // monthYearLabel    : 'LLL yyyy',
                    // dateA11yLabel     : 'DD',
                    // monthYearA11yLabel: 'LLLL yyyy',
                    // dateInput: 'DD/MM/YYYY', // Formato de visualización
                    // monthYearLabel: 'MMMM YYYY',
                    // dateA11yLabel: 'LL',
                    // monthYearA11yLabel: 'MMMM YYYY',
                },
            },
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
        { provide: MAT_DATE_FORMATS, useValue: MY_LUXON_FORMATS },

        // Transloco Config
        provideTransloco(),

        // Fuse
        provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            fuse: {
                layout: 'compact',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
    ],
};
