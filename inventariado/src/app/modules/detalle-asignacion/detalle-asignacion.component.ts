import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Asignacion } from 'src/app/core/model/asignacion.model';
import { AsignacionService } from 'src/app/core/services/asignacion.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-detalle-asignacion',
  templateUrl: './detalle-asignacion.component.html',
  styleUrls: ['./detalle-asignacion.component.css']
})
export class DetalleAsignacionComponent implements OnInit {

  asignacion: Asignacion | undefined;
  cargado = false;
  id: number;

  mensaje: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  constructor(
    private route: ActivatedRoute,
    private readonly asignacionService: AsignacionService,
    private readonly router: Router,
    private location: Location
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getAsignacion();
  }

  getAsignacion() {
    this.asignacionService.getAsignacionById(this.id).subscribe({
      next: (response) => {
        this.asignacion = response.message;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  volver() {
    this.location.back();
  }

  detalleEmpleado(id: number){
    this.router.navigate([`gestion/empleados/empleado/${id}`]);
  }

  detalleUnidad(id: number){
    this.router.navigate([`gestion/unidades/unidad/${id}`]);
  }

  finalizarAsig(){
    this.asignacionService.finalizarAsignacion(this.id).subscribe({
      next: (response) => {
        this.mensaje = response;
        if(this.mensaje.success){
          this.alerta(this.mensaje.message, 'success');
        }else{
          this.alerta(this.mensaje.error, 'success');
        }
        
      },
      error: (error) => {
        console.log(error);
        this.alerta("No se ha podido finalizar la asignación", 'danger');
      },
      complete: () => {
        this.cargaDatos();
      }
    })
  }

  editarAsig(){
    this.router.navigate([`gestion/asignaciones/asignacion/edit/${this.id}`]);
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

  irAsignaciones(){
    this.router.navigate([`gestion/asignaciones`]);
  }
}
