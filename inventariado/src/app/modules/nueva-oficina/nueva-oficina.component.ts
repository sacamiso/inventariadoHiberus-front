import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
import { Router } from '@angular/router';import { OficinaForm } from 'src/app/core/model/oficina.model';
import { OficinaService } from 'src/app/core/services/oficina.service';


@Component({
  selector: 'app-nueva-oficina',
  templateUrl: './nueva-oficina.component.html',
  styleUrls: ['./nueva-oficina.component.css']
})
export class NuevaOficinaComponent implements OnInit {

  oficinaForm: FormGroup;

  msg: MesaggeResponseNumber | undefined;
  alertPlaceholder: HTMLElement | null;

  cargado = false;
  formularioEnviado = false;

  oficina: OficinaForm = {
    codigoPostal: null,
    direccion:    '',
    localidad:    '',
    provincia:    null,
    pais:         '',
  }

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly oficinaService: OficinaService,
  ) {
    this.oficinaForm = this.formBuilder.group({
      codigoPostal: [null, [Validators.min(1), Validators.pattern(/^\d+$/)]],
      direccion:['', [Validators.required, this.noSoloEspacios]],
      localidad:['', [Validators.required, this.noSoloEspacios]],
      provincia: [null],
      pais: ['', [Validators.required, this.noSoloEspacios]]
    });
    this.alertPlaceholder = document.getElementById('liveAlert');
   }

   noSoloEspacios(control: any) {
    const valor = control.value;
    if (valor.trim() === '') {
      return { noSoloEspacios: true }; // Cadena compuesta solo de espacios
    }
    return null; // Cadena no compuesta solo de espacios
  }

  ngOnInit(): void {
    this.cargado = true;
  }

  guardar() {
    this.formularioEnviado = true;
    if (this.oficinaForm.invalid){
      return;
    }

    this.oficina = this.oficinaForm.getRawValue() as OficinaForm;
    this.guardarFormulario();
  }


  guardarFormulario(){
    this.oficinaService.guardarOficina(this.oficina).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta('Oficina añadida con éxito', 'success');
          this.formularioEnviado=false;
          this.router.navigate([`gestion/oficinas/oficina/${this.msg.message}`]);
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
    this.router.navigate([`gestion/oficinas`]);
  }
}
