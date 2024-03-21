import { Component, OnInit } from '@angular/core';
import { StockSeguridadService } from 'src/app/core/services/stock-seguridad.service';
import { Aviso } from 'src/app/core/model/aviso.model';
import { EventoAvisoService } from 'src/app/core/services/evento-aviso.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inventariado';

  avisos: Array<Aviso> = [];

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
      }
    })
  }
}
