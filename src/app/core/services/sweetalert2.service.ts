import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface IalertActionConfirm {
    info: string;
    callback: Function;
    icon: 'warning' | 'success' | 'error' | 'info';
    title?: string;
}

@Injectable({
    providedIn: 'root',
})
export class Sweetalert2Service {
    constructor() {}

    public startLoading({
        title = 'Cargando',
        html = 'Por favor espere',
    }): void {
        Swal.fire({
            title,
            html,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            timer: 500000,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    }

    public stopLoading(): void {
        Swal.close();
    }

    /**
     * despues de confirmar => .then((result : any)=>{if(result.isConfirmed){//logica}})
     */
    public async alertConfirmation(callBack: Function): Promise<void> {
        Swal.fire({
            allowOutsideClick: false,
            backdrop: true,
            title: '¿Estas seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            customClass: {
                actions: 'flex-row-reverse gap-2',
                cancelButton: 'rounded-full w-26 bg-gray-500 ring-0',
                confirmButton: 'rounded-full w-26 ring-0',
            },
        }).then((result: any) => {
            if (result.isConfirmed) {
                callBack();
            }
        });
    }

    public alertSuccessWithConfirm(param: any = {}): Promise<void> {
        return new Promise((resolve) => {
            Swal.fire({
                allowOutsideClick: false,
                backdrop: true,
                title: 'Correcto!',
                text: param.text || 'Solicitud realizada correctamente',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                customClass: {
                    confirmButton: 'rounded-full w-20 bg-blue-400 ring-0',
                },
            }).then((result: any) => {
                resolve();
            });
        });
    }

    public alertSuccess(text?: string): Promise<void> {
        return new Promise((resolve) => {
            text = text || 'Solicitud realizada correctamente';
            const alert = Swal.fire({
                allowOutsideClick: true,
                backdrop: true,
                title: 'Correcto!',
                html: text,
                icon: 'success',
                confirmButtonColor: '#3085d6',
                customClass: {
                    confirmButton: 'rounded-full w-20 bg-blue-400 ring-0',
                },
            }).then(() => {
                resolve();
            });
        });
    }

    public alertError(param?: any): void {
        // this.stopLoading();

        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            title: 'Error!',
            text:
                param?.text ||
                'Su solicitud no pudo ser procesada, por favor intente nuevamente',
            icon: 'error',
            customClass: {
                confirmButton: 'rounded-full w-20 bg-gray-400 ring-0',
            },
        });
    }

    public alertInfo({
        info = 'Lo sentimos, no se encontraron registros en la consulta',
    }): void {
        Swal.fire({
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            text: info,
            icon: 'info',
            customClass: {
                confirmButton: 'rounded-full w-20 bg-gray-400 ring-0',
            },
        });
    }

    public alertActionConfirm(options: IalertActionConfirm): void {
        const Alert = Swal.fire({
            allowOutsideClick: false,
            backdrop: true,
            text: options.info,
            icon: options.icon,
            customClass: {
                confirmButton: 'rounded-full w-20 bg-gray-400 ring-0',
            },
        });

        if (!!options.callback) {
            Alert.then((result) => {
                if (result.isConfirmed) {
                    options.callback();
                }
            });
        }
    }
}
