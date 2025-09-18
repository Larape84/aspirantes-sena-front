import { Injectable, signal, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    constructor() {}

    public msgError(form: FormGroup, control: string): string | null {
        if (
            form &&
            form.controls[control].touched &&
            form.controls[control].errors
        ) {
            const errors = form.controls[control].errors;

            if (errors?.required) {
                return 'Este campo es obligatorio';
            } else if (errors?.minlength) {
                return `El valor debe tener al menos ${errors.minlength.requiredLength} caracteres`;
            } else if (errors?.email) {
                return 'El correo no es válido';
            } else if (errors?.passwordMismatch) {
                return 'Las contraseñas no coinciden';
            } else if (errors?.onlyLetters) {
                return 'Solo se permiten letras sin espacios ni números';
            } else if (errors?.userExists) {
                return 'El valor ingresado ya se encuentra registrado';
            } else if (errors?.onlyLettersNoAccents) {
                return 'Solo se permiten letras sin caracteres especiales';
            } else if (errors?.lettersNumbersNoDoubleSpaces) {
                return 'Solo se permiten letras y números sin caracteres especiales';
            } else if (errors?.minDigits) {
                return `El valor debe tener al menos ${errors.minDigits.requiredLength} caracteres numericos`;
            }

            //   else if (errors?.customError) {
            //     return errors.customError;
            //   }
        }
        return null;
    }
}
