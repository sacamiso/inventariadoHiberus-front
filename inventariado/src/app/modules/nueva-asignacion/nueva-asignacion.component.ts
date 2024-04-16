import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AsignacionForm } from 'src/app/core/model/asignacion.model';
import { Empleado, EmpleadoList } from 'src/app/core/model/empleado.model';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Unidad, UnidadList } from 'src/app/core/model/unidad.model';
import { AsignacionService } from 'src/app/core/services/asignacion.service';
import { EmpleadoService } from 'src/app/core/services/empleado.service';
import { OficinaService } from 'src/app/core/services/oficina.service';
import { UnidadService } from 'src/app/core/services/unidad.service';

@Component({
  selector: 'app-nueva-asignacion',
  templateUrl: './nueva-asignacion.component.html',
  styleUrls: ['./nueva-asignacion.component.css']
})
export class NuevaAsignacionComponent implements OnInit {

  asignacionForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  asignacion: AsignacionForm = {
    fechaInicio:  new Date(),
    idEmpleado:   0,
    codUnidad:    0,
  }

  listOficinas: Array<Oficina> = [];
  listUnidades: UnidadList | undefined;
  listEmpleados: EmpleadoList | undefined ;

  cargado1 = false;
  idOficinaSeleccionada : number = 0;
  cargado2 = false;

  formularioEnviado = false;

  constructor(
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly unidadService: UnidadService,
    private readonly empleadoService: EmpleadoService,
    private readonly asignacionService: AsignacionService,
    private formBuilder: FormBuilder,
  ) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    this.asignacionForm = this.formBuilder.group({
      fechaInicio:  [null, Validators.required],
      idEmpleado:   [null, [Validators.required, Validators.min(1)]],
      codUnidad:    [null, [Validators.required, Validators.min(1)]]
    });
   }

  ngOnInit(): void {
    this.cargarDatos1();
  }

  async cargarDatos1() {
    await this.getOficinas();
    this.cargado1 = true;
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  async changeOfi(): Promise<void> {
    this.asignacionForm.reset();
    if(this.idOficinaSeleccionada != 0 && this.idOficinaSeleccionada!= null && this.idOficinaSeleccionada!= undefined) {
      await this.cargarDatos2();
      
    }else{
      this.cargado2 = false;
    }
  }

  async cargarDatos2() {
    await this.getEmpleados(this.idOficinaSeleccionada);
    await this.getUnidades(this.idOficinaSeleccionada);
    this.cargado2 = true;
  }

  async getEmpleados(idOf: number){
    this.listEmpleados = (await firstValueFrom(this.empleadoService.getEmpleadosByOficina(idOf)));
  }

  async getUnidades(idOf: number){
    this.listUnidades = await firstValueFrom(this.unidadService.getUnidadesSinAsignarDisponiblesByOficina(idOf));
  }

  volver(){
    this.router.navigate([`gestion/asignaciones`]);
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

  guardar() {
    this.formularioEnviado = true;
    if (this.asignacionForm.invalid){
      this.alerta('El formulario no es válido', 'danger');
      return;
    }
    this.asignacion = this.asignacionForm.getRawValue() as AsignacionForm;
    this.guardarFormulario();
  }

  guardarFormulario(){
    
    this.asignacionService.guardarAsignacion(this.asignacion).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta(this.msg.message, 'success');
          this.formularioEnviado=false;
          this.asignacionForm.reset();
          this.idOficinaSeleccionada = 0;
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
