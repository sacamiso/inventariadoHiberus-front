import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { Router } from '@angular/router';
import { Rol } from 'src/app/core/model/rol.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { EmpleadoService } from 'src/app/core/services/empleado.service';
import { RolService } from 'src/app/core/services/rol.service';
import { OficinaService } from 'src/app/core/services/oficina.service';
import { firstValueFrom } from 'rxjs';
import { EmpleadoForm } from 'src/app/core/model/empleado.model';

@Component({
  selector: 'app-nuevo-empleado',
  templateUrl: './nuevo-empleado.component.html',
  styleUrls: ['./nuevo-empleado.component.css']
})
export class NuevoEmpleadoComponent implements OnInit {

  empleadoForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  cargado = false;
  formularioEnviado = false;

  listRoles: Array<Rol> = [];
  listOficinas: Array<Oficina> = [];

  //Para almacenar el empleado cuando se le da a guardar
  empleado: EmpleadoForm = {
    dni:        '',
    nombre:     '',
    apellidos:  '',
    usuario:    '',
    contraseña: '',
    codRol:     '',
    idOficina:  0
  };

  constructor(
    private formBuilder: FormBuilder,
    private readonly empleadoService: EmpleadoService,
    private readonly router: Router,
    private readonly rolService: RolService,
    private readonly oficinaService: OficinaService
  ) { 
    this.empleadoForm = this.formBuilder.group({
      dni: ['', [Validators.required, this.validarDNI, this.noSoloEspacios]],
      nombre: ['', [Validators.required, this.noSoloEspacios]],
      apellidos: ['', [Validators.required, this.noSoloEspacios]],
      usuario: ['', [Validators.required, this.noSoloEspacios]],
      contraseña: ['', [Validators.required, this.noSoloEspacios]],
      codRol: ['', [Validators.required, this.noSoloEspacios]],
      idOficina: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]]
    });

    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getRoles();
    await this.getOficinas();
    this.cargado = true;
  }

  async getRoles(){
    this.listRoles = await firstValueFrom(this.rolService.getAllRoles());
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  noSoloEspacios(control: any) {
    const valor = control.value;
    if (valor.trim() === '') {
      return { noSoloEspacios: true }; // Cadena compuesta solo de espacios
    }
    return null; // Cadena no compuesta solo de espacios
  }

  validarDNI(control: any) {
    const dni = control.value;
    const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i; // Expresión regular para validar DNI
    if (!dniRegex.test(dni)) {
      return { dniInvalido: true }; // DNI inválido si no coincide con el formato esperado
    }

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
    const numero = dni.substr(0, dni.length - 1);
    const letraCalculada = letras[numero % 23];

    if (letraCalculada !== dni.charAt(dni.length - 1).toUpperCase()) {
      return { dniInvalido: true }; // La letra del DNI no coincide con la letra calculada
    }

    return null; // DNI válido
  }

  guardar() {
    this.formularioEnviado = true;
    if (this.empleadoForm.invalid){
      return;
    }

    this.empleado = this.empleadoForm.getRawValue() as EmpleadoForm;
    this.trimStringProperties(this.empleado);
    this.guardarFormulario();
  }

  trimStringProperties(obj: any) {
    for (const prop in obj) {
        if (typeof obj[prop] === 'string') {
            if (obj[prop].trim() === '') {
                obj[prop] = null;
            } else {
                obj[prop] = obj[prop].trim();
            }
        }
    }
  }

  guardarFormulario(){
    this.empleadoService.guardarEmpleado(this.empleado).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta(this.msg.message, 'success');
          this.formularioEnviado=false;
          this.empleadoForm.reset();
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
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

  volver(){
    this.router.navigate([`gestion/empleados`]);
  }

}
