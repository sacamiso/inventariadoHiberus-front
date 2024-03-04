import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { SalidaForm } from 'src/app/core/model/salida.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { ArticuloService } from '../../core/services/articulo.service';
import { OficinaService } from '../../core/services/oficina.service';
import { SalidaService } from '../../core/services/salida.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.component.html',
  styleUrls: ['./nueva-salida.component.css']
})
export class NuevaSalidaComponent implements OnInit {

  salidaForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  saldia: SalidaForm = {
    numUnidades: 0,
    costeTotal: 0,
    costeUnitario: 0,
    fechaSalida: new Date(),
    idOficina: 0,
    codArticulo: 0
  }

  listArticulos: Array<Articulo> = [];
  listOficina: Array<Oficina> = [];

  cargado = false;

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
    private readonly salidaService: SalidaService,
  ) { 
    this.salidaForm = this.formBuilder.group({
      idOficina: [null, Validators.required],
      codArticulo: [null, Validators.required],
      fechaSalida: [null, Validators.required],
      numUnidades: [null, [Validators.required, Validators.pattern('^(-?\\d+)$'), Validators.min(1)]],
      costeTotal: [null, [Validators.required, Validators.min(0)]],
      costeUnitario: [null, [Validators.required, Validators.min(0)]],
    });

    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {

  }

}
