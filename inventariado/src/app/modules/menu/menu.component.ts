import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventoAvisoService } from '../../core/services/evento-aviso.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy  {

  hayAvisos = false;


  private hayAvisosSubscription: Subscription = new Subscription();

  seleccionado: number = 0;
  constructor(
    private eventoAvisoService: EventoAvisoService
  ) { }

  ngOnInit(): void {
    this.hayAvisosSubscription = this.eventoAvisoService.hayAvisos$.subscribe(hayAvisos => {
      this.hayAvisos = hayAvisos;
    });
  }

  ngOnDestroy(): void {
    this.hayAvisosSubscription.unsubscribe();
  }

  cambiaSeleccionado(activo: number) {
    switch (activo) {
      case 0:
        this.seleccionado = 0;
        break;
      case 1:
        this.seleccionado = 1;
        break;
      case 2:
        this.seleccionado = 2;
        break;
      case 3:
        this.seleccionado = 3;
        break;
      case 4:
        this.seleccionado = 4;
        break;
      case 5:
          this.seleccionado = 5;
          break;
      default:
        this.seleccionado = 0;
        break;
    }
  }

  dropdownOpen = false;

  toggleDropdown(open: boolean) {
      this.dropdownOpen = open;
  }

}
