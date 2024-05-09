import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventoAvisoService } from '../../core/services/evento-aviso.service';
import { Empleado } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy  {

  hayAvisos = false;

  user: Empleado | null = null;
  isLogged: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => {this.refreshHeader();});
  
  private hayAvisosSubscription: Subscription = new Subscription();

  seleccionado: number = 0;
  constructor(
    private eventoAvisoService: EventoAvisoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.hayAvisosSubscription = this.eventoAvisoService.hayAvisos$.subscribe(hayAvisos => {
      this.hayAvisos = hayAvisos;
    });
  }

  async refreshHeader() {
    
    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => {this.user = null;})
    if(this.authService.isLogged()) {
      //this.cargarHeaderItemsLogged();
      this.isLogged = true;
      
    } else {
      //this.cargarHeaderItemsUnlogged();
      this.isLogged = false;
      
    }
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
      case 6:
        this.seleccionado = 6;
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
