import { Component, OnInit } from '@angular/core';
import { Asignacion, AsignacionEdit } from 'src/app/core/model/asignacion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AsignacionService } from 'src/app/core/services/asignacion.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fechaFinMayorQueInicioValidator } from 'src/app/core/directives/fecha-fin-asignacion.directive';

@Component({
  selector: 'app-asignacion-edit',
  templateUrl: './asignacion-edit.component.html',
  styleUrls: ['./asignacion-edit.component.css']
})
export class AsignacionEditComponent implements OnInit {

  editAsignacionForm: FormGroup;
  asignacion: Asignacion | undefined;
  cargado = false;

  asignacionE: AsignacionEdit = {
    fechaInicio:  new Date(),
    fechaFin:  new Date(),
  }

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  id: number;
  formularioEnviado = false;
  idAsignacion: number = 0;

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly asignacionService: AsignacionService,
    private location: Location,
    private formBuilder: FormBuilder
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alertPlaceholder = document.getElementById('liveAlert');

    this.editAsignacionForm = this.formBuilder.group({
      fechaInicio:  [null, Validators.required],
      fechaFin:  [null, [fechaFinMayorQueInicioValidator('fechaInicio')]]
    });
  }

  
  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.cargaAsignacion();
    this.editAsignacionForm.setValue({fechaInicio: this.asignacion?.fechaInicio , fechaFin: this.asignacion?.fechaFin});
    if(this.asignacion){
      this.idAsignacion=this.asignacion.idAsignacion;
    }
    this.cargado = true;
  }

  async cargaAsignacion(){
    this.asignacion = (await firstValueFrom(this.asignacionService.getAsignacionById(this.id))).message;
  }

  detalleEmpleado(id: number){
    this.router.navigate([`gestion/empleados/empleado/${id}`]);
  }

  volver() {
    this.location.back();
  }

  detalleUnidad(id: number){
    this.router.navigate([`gestion/unidades/unidad/${id}`]);
  }

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);

    // Establecer un temporizador para eliminar la alerta después de 20 segundos
    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 20000); // 20000 milisegundos = 20 segundos
  }

  guardar(){
    this.formularioEnviado = true;
    if (this.editAsignacionForm.invalid){
      return;
    }
    this.asignacionE = this.editAsignacionForm.getRawValue() as AsignacionEdit;
    this.guardarFormulario();
  }

  guardarFormulario(){
    
    this.asignacionService.editarAsignacion(this.asignacionE, this.idAsignacion).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta(this.msg.message, 'success');
          this.formularioEnviado=false;
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
  }
}
