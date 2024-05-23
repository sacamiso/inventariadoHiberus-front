import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockSeguridadService } from 'src/app/core/services/stock-seguridad.service';
import { Aviso } from 'src/app/core/model/aviso.model';
import { EventoAvisoService } from 'src/app/core/services/evento-aviso.service';
import { Subscription, interval } from 'rxjs';
import { Empleado } from './core/model/empleado.model';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'inventariado';

  avisos: boolean = false;

  //Este intervalo hace que la comprovación de si hay avisos se ejecute cada 3 segundos
  //Pero hay que considerar que no se hace llamada a base de datos
  //Solo se comprueba una variable global en el back
  intervalo = 3000; 

  user: Empleado | null = null;
  isAdmin: boolean = false;
  private intervalSubscription: Subscription | null = null;
  private loginSubscription: Subscription;

  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private eventoAvisoService: EventoAvisoService,
    private authService: AuthService
  ) {
    this.loginSubscription = this.authService.loginSubject.subscribe(() => { 
      this.refreshHeader(); 
    });
   }

   async refreshHeader() {
    try {
      const user = await this.authService.getLoggedUser();
      this.user = user;
      this.authService.usuarioActual = user;
      this.isAdmin = this.authService.isAdmin;

      // Reiniciar la suscripción al intervalo solo si el usuario es administrador
      if (this.isAdmin) {
        if (!this.intervalSubscription) {
          this.startAvisosCheck();
        }
      } else {
        this.stopAvisosCheck();
      }
    } catch (error) {
      console.error('Error al refrescar el encabezado', error);
      this.user = null;
      this.authService.usuarioActual = null;
      this.isAdmin = false;
      this.stopAvisosCheck();
    }
  }

  ngOnInit(): void {
    this.refreshHeader();
    this.hayAvisos();
  }

  ngOnDestroy(): void {
    this.stopAvisosCheck();
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  startAvisosCheck() {
    this.stopAvisosCheck(); // Ensure previous interval is cleared
    this.intervalSubscription = interval(this.intervalo).subscribe(() => {
      this.hayAvisosCron();
    });
  }

  stopAvisosCheck() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
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
