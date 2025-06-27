import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from 'app/core/services/services-firebase.service';
import { Sweetalert2Service } from 'app/core/services/sweetalert2.service';
import { SharedModuleModule } from 'app/shared/module/shared-module.module';
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { Observable, Subject, Subscription, take } from 'rxjs';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';
import { InicioSesionService } from 'app/modules/auth/sign-in/inicio-sesion.service';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss'],
  standalone:true,
  imports:[SharedModuleModule ]
})
export class ScanQrComponent implements AfterViewInit, OnDestroy {

  scanner!: Html5Qrcode ;

  cameras: MediaDeviceInfo[] = [];
  selectedCameraId: string | null = null;
  totalCamars = []
  indexCam = 0
  ngModelCam = null
  user = null

  imageInput = null

  constructor(
    private cd : ChangeDetectorRef,
    private sweetAlertService : Sweetalert2Service,
    private _fireService : FirebaseService,
    private _inicioSesionService : InicioSesionService
){}


    ngOnDestroy(): void {
        this.scanner.stop()
    }

  ngAfterViewInit() {
    this.user =  this._inicioSesionService.obtenerUsuario()
    this.inictcAM()

  }

  public async inictcAM(): Promise<void> {

    this.sweetAlertService.startLoading({})


    this.scanner = new Html5Qrcode("reader");
    //
    this.totalCamars = await Html5Qrcode.getCameras();


    this.cameras = this.totalCamars
    if (this.totalCamars.length > 0) {
        const camaraBack = this.totalCamars.findIndex(item=>String(item?.label)?.toLowerCase()?.includes('back'))
        if(camaraBack!==-1){
            this.indexCam = camaraBack

        }
      this.selectedCameraId = this.totalCamars[this.indexCam].id;
      this.ngModelCam = this.selectedCameraId

      this.startScanner();

    }else{

        this.sweetAlertService.stopLoading()

        setTimeout(() => {
            const param = {text: 'Lo sentimos, no se encontro una camara en el dispositivo para escanear codigo QR'}
             Swal.fire({
                  allowOutsideClick: true,
                  backdrop: true,
                  title: 'Error!',
                  text: param?.text || "Su solicitud no pudo ser procesada, por favor intente nuevamente",
                  icon: 'error',
                  customClass: {
                    confirmButton: 'rounded-full w-20 bg-gray-400 ring-0'
                  }
                }).then(()=>{
                    this.inictcAM()
                })
        }, 200);
    }


  }

  startScanner() {

    setTimeout(() => {

        this.scanner.start(
            this.selectedCameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => this.onScanSuccess(decodedText),
            (errorMessage) => {})
            this.scanner.clear()
            setTimeout(() => {
                this.sweetAlertService.stopLoading()
            }, 1000);
                // this.scanner.resume()






    }, 500);


  }


  public cargarImagn(event): void {
    const file = event.target.files[0];
    this.scanner.stop().then(()=>{

        if (file) {
          this.scanner.scanFileV2(file, true)
            .then(decodedText => {
                this.onScanSuccess(decodedText.decodedText)

            })
            .catch(err => console.error("Error al escanear:", err));
        }
    })
  }


  switchCamera(cameraId: string) {
    this.selectedCameraId = cameraId;
    this.scanner.stop().then(() => this.startScanner());
    this.cd.detectChanges()
  }

//   switchCamera() {




//         this.scanner.stop().then(()=>{

//             this.scanner.clear()

//             this.indexCam = this.indexCam + 1
//             const a = [this.indexCam,this.totalCamars.length]
//             // window.alert(a.join(" "))

//             if( this.indexCam > (this.totalCamars.length-1) ){
//                 this.indexCam = 0
//             }


//                 this.startScanner()


//         })







//   }

  onScanSuccess(result: string) {

    if(String(this.user.id) === String(result)){
        return
    }

    this.scanner.pause()






    this.sweetAlertService.startLoading({})

    const hoy = DateTime.local().toFormat('dd-MM-yyyy');
    const fechaNumero = DateTime.local().toFormat('yyyyMMdd');
    const hora = DateTime.local().toFormat('HH:mm:ss');



    const valorConsulta = this.registroConsulta(result)

    if(!!valorConsulta){
        this._fireService.getDocumentId('registros', `${hoy} ${valorConsulta}`).subscribe({
            next:(resp)=>{


                if(!!resp){
                    this.sweetAlertService.stopLoading();

                    setTimeout(() => {
                        Swal.fire({
                            allowOutsideClick: false,
                            backdrop: true,
                            title: 'Lo sentimos',
                            text: `Usted ya realizo la solicitud`,
                            icon: 'info',
                            showCancelButton: false,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Aceptar',
                          cancelButtonText: 'Cancelar',
                          customClass: {
                            actions: 'flex-row-reverse gap-2',
                            cancelButton: 'rounded-full w-26 bg-gray-500 ring-0',
                            confirmButton: 'rounded-full w-26 ring-0'
                          }}).then((result: any) => {
                            this.switchCamera(this.selectedCameraId)

                          })
                    }, 200);

                    return
                }



            },
            error:()=>{



                    this.sweetAlertService.stopLoading();


                    setTimeout(() => {
                        Swal.fire({
                            allowOutsideClick: false,
                            backdrop: true,
                            title: 'Solicitud de comida',
                            text: `Desea proceder con la solictud ? `,
                            icon: 'info',
                            showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Aceptar',
                          cancelButtonText: 'Cancelar',
                          customClass: {
                            actions: 'flex-row-reverse gap-2',
                            cancelButton: 'rounded-full w-26 bg-gray-500 ring-0',
                            confirmButton: 'rounded-full w-26 ring-0'
                          }}).then((result: any) => {

                            if(result?.isConfirmed){

                                this.sweetAlertService.startLoading({})

                                const data = {
                                    fecha: hoy,
                                    hora:  hora,
                                    nombreAutizado :this.user.nombre,
                                    apellidoAutorizado : this.user.apellido,
                                    idAutorizado : this.user.id,
                                    cargoAutorizado : this.user.cargo,
                                    idSocicitante : valorConsulta,
                                    fechaNumero: Number(fechaNumero)
                                }

                                this._fireService.createDocumentWithId('registros', `${hoy} ${valorConsulta}`, data ).subscribe({
                                    next:(resp)=>{
                                        setTimeout(() => {
                                            this.sweetAlertService.alertSuccessWithConfirm().then(()=>{
                                                this.switchCamera(this.selectedCameraId)
                                            })
                                        }, 200);
                                    }
                                })



                            }else{
                                this.switchCamera(this.selectedCameraId)
                            }

                          })
                    }, 200);















            }}

        )
    }else{

        this.sweetAlertService.stopLoading();

        setTimeout(() => {
            Swal.fire({
                allowOutsideClick: false,
                backdrop: true,
                title: 'Lo sentimos',
                text: `Se encuentra fuera del horario laboral`,
                icon: 'info',
                showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aceptar',
              cancelButtonText: 'Cancelar',
              customClass: {
                actions: 'flex-row-reverse gap-2',
                cancelButton: 'rounded-full w-26 bg-gray-500 ring-0',
                confirmButton: 'rounded-full w-26 ring-0'
              }}).then((result: any) => {
                this.switchCamera(this.selectedCameraId)

              })
        }, 200);



    }










  }

  public validarRegistro(): void{


  }


  public registroConsulta(registro): string {

    const now = DateTime.local(); // Hora actual del sistema

        // Definir los rangos
        const startRange1 = now.set({ hour: 7, minute: 0 });
        const endRange1 = now.set({ hour: 10, minute: 30 });

        const startRange2 = now.set({ hour: 11, minute: 0 });
        const endRange2 = now.set({ hour: 23, minute: 0 });

        // Evaluar en qué rango está
        if (now >= startRange1 && now <= endRange1) {
          return `${registro}-1`;
        } else if (now >= startRange2 && now <= endRange2) {
          return `${registro}-2`;
        }

        return; // Si no está en ningún rango
      }














}
