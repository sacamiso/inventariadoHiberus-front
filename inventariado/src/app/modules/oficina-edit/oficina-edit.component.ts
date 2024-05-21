import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Oficina } from 'src/app/core/model/oficina.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OficinaService } from 'src/app/core/services/oficina.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-oficina-edit',
  templateUrl: './oficina-edit.component.html',
  styleUrls: ['./oficina-edit.component.css']
})
export class OficinaEditComponent implements OnInit {

  oficina: Oficina | undefined;
  cargado = false;
  id: number;

  oficinaForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  formularioEnviado = false;

  constructor(
    private route: ActivatedRoute,
    private readonly oficinaService: OficinaService,
    private readonly router: Router,
    private location: Location,
    private formBuilder: FormBuilder,
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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


  guardar() {
    this.formularioEnviado = true;
    if (this.oficinaForm.invalid){
      return;
    }

    this.oficina = this.oficinaForm.getRawValue() as Oficina;
    this.guardarFormulario();
  }

  guardarFormulario(){
    if(this.oficina){
      this.oficinaService.editarOficina(this.oficina, this.id).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta('Oficina editada con éxito', 'success');
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


  ngOnInit(): void {
    this.cargaDatos();
  }

  async cargaDatos() {
    await this.getOficina();

    this.oficinaForm.patchValue({
      codigoPostal: this.oficina?.codigoPostal,
      direccion: this.oficina?.direccion,
      localidad: this.oficina?.localidad,
      provincia: this.oficina?.provincia,
      pais: this.oficina?.pais,
    });
    this.cargado = true;
  }

  async getOficina(){
    this.oficina = (await firstValueFrom(this.oficinaService.getOficinaById(this.id))).message;
  }

  volver() {
    this.location.back();
  }
}
