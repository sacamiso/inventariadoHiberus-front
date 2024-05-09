import { Component, OnInit } from '@angular/core';
import { StockSeguridadService } from 'src/app/core/services/stock-seguridad.service';
import { Aviso } from 'src/app/core/model/aviso.model';
import { EventoAvisoService } from 'src/app/core/services/evento-aviso.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'inventariado';

  avisos: boolean = false;

  //Este intervalo hace que la comprovación de si hay avisos se ejecute cada segundo
  //Pero hay que considerar que no se hace llamada a base de datos
  //Solo se comprueba una variable global en el back
  intervalo = 1000; 


  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private eventoAvisoService: EventoAvisoService
  ) { }

  ngOnInit(): void {
    this.hayAvisos();
    // interval(this.intervalo).subscribe(() => {
    //   this.hayAvisosCron();
    // });
  }

  hayAvisos() {
    this.stockSeguridadService.hayAvisos().subscribe({
      next: (response) => {
        console.log("ejecutado1");
        this.avisos = response.message;
        this.eventoAvisoService.actualizarEstadoHayAvisos(this.avisos);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  hayAvisosCron() {
    this.stockSeguridadService.hayAvisosCron().subscribe({
      next: (response) => {
        console.log("ejecutado2");
        this.avisos = response.message;
        this.eventoAvisoService.actualizarEstadoHayAvisos(this.avisos);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
