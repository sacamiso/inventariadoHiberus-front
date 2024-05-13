import { Component, OnInit } from '@angular/core';
import { debug } from 'console';
import { Message } from 'primeng/api';
import { Empleado, EmpleadoCambioContrasena } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent implements OnInit {

  contraAct = "";
  contraNueva = "";
  contraNuevaRepit = "";
  messages: Message[] = [];

  empleadoContrasena: EmpleadoCambioContrasena | undefined;
  user: Empleado | null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshHeader();
  }

  async refreshHeader() {
    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => { this.user = null; })
  }

  cambiarContrasena(){
    this.messages = [];

    if (this.contraAct==="" || this.contraNueva==="" || this.contraNuevaRepit==="" 
        || this.contraAct===undefined || this.contraNueva===undefined || this.contraNuevaRepit===undefined 
        || this.contraAct===null || this.contraNueva===null || this.contraNuevaRepit===null) {
      this.messages.push({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios.' });
      return;
    }

    if (this.contraNueva !== this.contraNuevaRepit) {
      this.messages.push({ severity: 'error', summary: 'Error', detail: 'La nueva contraseña y su repetición no coinciden.' });
      return;
    }

    if (this.contraAct === this.contraNueva) {
      this.messages.push({ severity: 'error', summary: 'Error', detail: 'La nueva contraseña debe ser diferente a la contraseña actual.' });
      return;
    }

    if(this.user)
    this.empleadoContrasena = {
      empleado: this.user,
      contraAct: this.contraAct,
      contraNueva: this.contraNueva
    }
    
  }
}
