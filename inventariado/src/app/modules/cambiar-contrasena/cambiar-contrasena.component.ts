import { Component, OnInit } from '@angular/core';
import { debug } from 'console';
import { Message } from 'primeng/api';
import { Empleado, EmpleadoCambioContrasena } from 'src/app/core/model/empleado.model';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { EmpleadoService } from 'src/app/core/services/empleado.service';


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

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  constructor(
    private authService: AuthService,
    private readonly empleadoService: EmpleadoService,
  ) {
    this.alertPlaceholder = document.getElementById('liveAlert');
   }

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

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);
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

    if(this.empleadoContrasena){
      this.empleadoService.cambiarContrasena(this.empleadoContrasena).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta('Contraseña actualizada con éxito', 'success');
            this.contraAct="";
            this.contraNueva="";
            this.contraNuevaRepit=""
            
          }else{
            this.alerta(this.msg.error, 'danger');
          }
        },
        error: (error) => {
          this.alerta(error.error.error, 'danger');
        }
      })
    }else{
      this.alerta('Se ha producido un error en el proceso de actualización', 'danger');
    }
    
  }
}
