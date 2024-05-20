import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
import { ProveedorService } from '../../core/services/proveedor.service';
import { Router } from '@angular/router';
import { ProveedorForm } from 'src/app/core/model/proveedor.model';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css']
})
export class NuevoProveedorComponent implements OnInit {

  proveedorForm: FormGroup;

  msg: MesaggeResponseNumber | undefined;
  alertPlaceholder: HTMLElement | null;

  cargado = false;
  formularioEnviado = false;

  //Para almacenar el proveedor cuando se le da a guardar
  proveedor: ProveedorForm = {
    cif:'',
    razonSocial:'',
    direccion:'',
    codigoPostal: null,
    localidad:'',
    telefono:'',
    email:'',
  };

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly proveedorService: ProveedorService,
  ) { 
    this.proveedorForm = this.formBuilder.group({
      cif: [null, [Validators.required, this.validarCIF]], 
      razonSocial:[null, Validators.required],
      direccion:[null, Validators.required],
      codigoPostal: [null, [Validators.min(0), Validators.pattern(/^\d+$/)]],
      localidad:[null, Validators.required],
      telefono: [null, [Validators.required, this.validarTelefono]],
      email: [null, [Validators.required, Validators.email]]
    });
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargado = true;
  }

  guardar() {
    this.formularioEnviado = true;
    if (this.proveedorForm.invalid){
      return;
    }

    this.proveedor = this.proveedorForm.getRawValue() as ProveedorForm;
    this.guardarFormulario();
  }

  guardarFormulario(){
    this.proveedorService.guardarProveedor(this.proveedor).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta('Proveedor añadido con éxito', 'success');
          this.formularioEnviado=false;
          this.router.navigate([`gestion/proveedores/proveedor/${this.msg.message}`]);
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

    // Establecer un temporizador para eliminar la alerta después de 20 segundos
    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 20000); // 20000 milisegundos = 20 segundos
  }

  volver(){
    this.router.navigate([`gestion/proveedores`]);
  }

  validarCIF(control: any) {
    const cif = control.value;
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]{1}[0-9]{7}[0-9A-J]$/; // Expresión regular para validar CIF
    if (cifRegex.test(cif)) {
      return null; // CIF válido
    } else {
      return { cifInvalido: true }; // CIF inválido
    }
  }

  validarTelefono(control: any) {
    const telefono = control.value;
    // Expresión regular para validar números de teléfono con o sin prefijo internacional
    const telefonoRegex = /^(\(\+[0-9]{1,3}\)\s?)?[0-9]{9,}$/; 
    if (telefonoRegex.test(telefono)) {
      return null; // Teléfono válido
    } else {
      return { telefonoInvalido: true }; // Teléfono inválido
    }
  }
}
