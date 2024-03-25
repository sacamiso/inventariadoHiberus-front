import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';
import { Aviso } from 'src/app/core/model/aviso.model';
import { EventoAvisoService } from '../../core/services/evento-aviso.service';
import { Subscription, interval } from 'rxjs';



@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']
})
export class AvisosComponent implements OnInit, OnDestroy {

  avisos: Array<Aviso> = [];
  cargado = false;

  hayAvisos = false;
  private hayAvisosSubscription: Subscription = new Subscription();


  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private eventoAvisoService: EventoAvisoService
  ) { }

  ngOnInit(): void {
    let cargaInicial = true;
    this.hayAvisosSubscription = this.eventoAvisoService.hayAvisos$.subscribe(hayAvisos => {
        if (hayAvisos != this.hayAvisos){
          console.log('bbbbb',hayAvisos);
          this.hayAvisos = hayAvisos;
          cargaInicial = false;
          this.listaAvisos();   
        } else if (cargaInicial){
          cargaInicial = false;
          this.listaAvisos();
        }
    });
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

  ngOnDestroy(): void {
    this.hayAvisosSubscription.unsubscribe();
  }

}
