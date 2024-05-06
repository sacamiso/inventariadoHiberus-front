import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AsignacionForm } from 'src/app/core/model/asignacion.model';
import { Empleado, EmpleadoList } from 'src/app/core/model/empleado.model';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
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

  msg: MesaggeResponseNumber | undefined;
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
  selectedItemId: any = null;
  selectedItemId2: any = null;

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
    this.buildForm();
    this.cargarDatos1();
  }

  buildForm(){
    this.asignacionForm = this.formBuilder.group({
      fechaInicio:  [null, Validators.required],
      idEmpleado:   [null, [Validators.required, Validators.min(1)]],
      codUnidad:    [null, [Validators.required, Validators.min(1)]]
    });
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
      this.buildForm();
      
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
          this.alerta('Asignación añadida con éxito', 'success');
          this.formularioEnviado=false;
          this.asignacionForm.reset();
          this.idOficinaSeleccionada = 0;
          this.router.navigate([`gestion/asignaciones/asignacion/${this.msg.message}`]);
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
  }


  filteredOficinas: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  filterOficina(event: any) {
    let query = event.query;
    this.filteredOficinas = this.listOficinas.filter(oficina => {
        const fullDescription = `${oficina.direccion}, ${oficina.localidad}`;
        return fullDescription.toLowerCase().includes(query.toLowerCase());
    });
  }

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.idOficinaSeleccionada = event.idOficina;
    this.changeOfi();
  }

  onClear() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.idOficinaSeleccionada = this.lastSelectedOficina.idOficina;
    }  else {
      this.selectedOficina = undefined; 
      this.idOficinaSeleccionada = 0;
    }
    this.changeOfi();
  }

  getFullDescription(oficina: Oficina) {
    return `${oficina.direccion}, ${oficina.localidad}`;
  }

  checkIfValidInput(event: KeyboardEvent) {

    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listOficinas.some(oficina => 
        this.getFullDescription(oficina).toLowerCase()===inputValue,
    );

    if (!match) {
      this.onClear();
    }else{
      this.listOficinas.forEach(oficina => {
        if(this.getFullDescription(oficina).toLowerCase()===inputValue){
          this.selectedOficina = oficina;
          this.idOficinaSeleccionada = oficina.idOficina;
          this.lastSelectedOficina = oficina;
          this.changeOfi();
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }
}
