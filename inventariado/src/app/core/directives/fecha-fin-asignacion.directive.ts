import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[appFechaFinAsignacion]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FechaFinAsignacionDirective, multi: true }]
})
export class FechaFinAsignacionDirective implements Validator{

  validate(control: AbstractControl): ValidationErrors | null {
    const fechaSeleccionada = new Date(control.value);
    const fechaActual = new Date();

    if (fechaSeleccionada > fechaActual) {
      return { 'fechaFinInvalida': true };
    }
    return null;
  }

}
export function fechaFinMayorQueInicioValidator(fechaInicio: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fechaInicioControl = control.root.get(fechaInicio);
    if (fechaInicioControl && control.value) {
      const fechaInicioValue = new Date(fechaInicioControl.value);
      const fechaFinValue = new Date(control.value);

      if (fechaFinValue < fechaInicioValue) {
        return { 'fechaFinAntesInicio': true };
      }
    }
    return null;
  };
}