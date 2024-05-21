import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/core/model/proveedor.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedorService } from 'src/app/core/services/proveedor.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-proveedor-edit',
  templateUrl: './proveedor-edit.component.html',
  styleUrls: ['./proveedor-edit.component.css']
})
export class ProveedorEditComponent implements OnInit {

  proveedor: Proveedor | undefined;
  cargado = false;
  id: number;

  proveedorForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  formularioEnviado = false;

  constructor(
    private route: ActivatedRoute,
    private readonly proveedorService: ProveedorService,
    private readonly router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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
    this.cargaDatos();
  }

  async cargaDatos() {
    await this.getProveedor();

    this.proveedorForm.patchValue({
      cif: this.proveedor?.cif,
      razonSocial: this.proveedor?.razonSocial,
      direccion: this.proveedor?.direccion,
      codigoPostal: this.proveedor?.codigoPostal,
      localidad: this.proveedor?.localidad,
      telefono: this.proveedor?.telefono,
      email: this.proveedor?.email,
    });

    this.cargado = true;
  }

  async getProveedor(){
    this.proveedor = (await firstValueFrom(this.proveedorService.getProveedorById(this.id))).message;
  }

  guardar() {
    this.formularioEnviado = true;
    if (this.proveedorForm.invalid){
      return;
    }

    this.proveedor = this.proveedorForm.getRawValue() as Proveedor;
    this.guardarFormulario();
  }

  guardarFormulario(){
    if(this.proveedor){
      this.proveedorService.editarProveedor(this.proveedor, this.id).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta('Proveedor editado con éxito', 'success');
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

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);

    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 5000);
  }
  volver() {
    this.location.back();
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
