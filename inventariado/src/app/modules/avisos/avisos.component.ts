import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';
import { Aviso } from 'src/app/core/model/aviso.model';
import { EventoAvisoService } from '../../core/services/evento-aviso.service';



@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']
})
export class AvisosComponent implements OnInit {

  avisos: Array<Aviso> = [];
  cargado = false;

  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private eventoAvisoService: EventoAvisoService
  ) { }

  ngOnInit(): void {
    this.listaAvisos();
  }

  listaAvisos() {
    this.stockSeguridadService.getAvisos().subscribe({
      next: (response) => {
        this.avisos = response.message;
        this.eventoAvisoService.actualizarEstadoHayAvisos(this.avisos.length > 0);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

}
