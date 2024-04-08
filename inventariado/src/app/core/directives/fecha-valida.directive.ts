import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appFechaValida]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FechaValidaDirective, multi: true }]
})

export class FechaValidaDirective implements Validator{
  validate(control: AbstractControl): ValidationErrors | null {
    const fechaSeleccionada = new Date(control.value);
    const fechaActual = new Date();

    if (fechaSeleccionada > fechaActual) {
      return { 'fechaInvalida': true };
    }
    return null;
  }
}
