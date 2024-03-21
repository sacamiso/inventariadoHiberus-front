import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoAvisoService {

  private hayAvisos = new Subject<boolean>();

  hayAvisos$ = this.hayAvisos.asObservable();

  constructor() { }

  actualizarEstadoHayAvisos(hayAvisos: boolean) {
    this.hayAvisos.next(hayAvisos);
  }
}
