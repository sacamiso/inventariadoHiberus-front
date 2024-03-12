import { Component, OnInit } from '@angular/core';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Estado } from 'src/app/core/model/estado.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { UnidadForm } from 'src/app/core/model/unidad.model';
import { OficinaService } from '../../core/services/oficina.service';
import { EstadoService } from '../../core/services/estado.service';
import { UnidadService } from '../../core/services/unidad.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-nueva-unidad',
  templateUrl: './nueva-unidad.component.html',
  styleUrls: ['./nueva-unidad.component.css']
})
export class NuevaUnidadComponent implements OnInit {

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  unidad: UnidadForm = {
    codigoInterno: 0,
    codEstado: "",
    numeroPedido:null,
    idOficina:0,
    codArticulo:0,
  }

  listOficina: Array<Oficina> = [];
  listArticulo: Array<Articulo> = [];
  listPedido: Array<Pedido> = [];
  listEstados: Array<Estado> = [];
  
  cargado = false;
  cargado2 = false;
  cargado3 = false;

  idOficinaSeleccionada : number = 0;
  codArticuloSeleccionado : number = 0;
  estadoSeleccionado : string = "";

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly oficinaService: OficinaService,
    private readonly unidadService: UnidadService,
    private readonly estadoService: EstadoService,
  ) { 
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarDatos1();
  }

  async cargarDatos1() {
    await this.getOficinas();
    await this.getEstados();
    this.cargado = true;
  }

  async changeOfi(): Promise<void> {
    this.cargado3 = false;
    this.codArticuloSeleccionado = 0;
    this.unidad.numeroPedido = null;
    if(this.idOficinaSeleccionada !== 0 && this.idOficinaSeleccionada!== null && this.idOficinaSeleccionada!== undefined) {
      await this.cargarDatos2();
      this.cargado2 = true;
      
    }else{
      this.cargado2 = false;
    }
  }

  async changeArticulo(): Promise<void> {
    this.unidad.numeroPedido = null;
    if(this.codArticuloSeleccionado !== 0 && this.codArticuloSeleccionado!== null && this.codArticuloSeleccionado!== undefined) {
      await this.cargarDatos3();
      this.cargado3 = true;
    }else{
      this.cargado3 = false;
    }
  }

  async cargarDatos3() {
    await this.getPedidosByOfArt(this.idOficinaSeleccionada, this.codArticuloSeleccionado);
  }

  async getPedidosByOfArt(idOf: number, codArt: number) {
    const p = await firstValueFrom(this.unidadService.getPedidosDisponible(idOf,codArt));
    this.listPedido = p.message;
  }

  async cargarDatos2() {
    await this.getArticulosByOf(this.idOficinaSeleccionada);
  }

  async getArticulosByOf(idOf: number){
    this.listArticulo = await firstValueFrom(this.unidadService.getArticulosDisponiblesByOficina(idOf));
  }

  async getOficinas(){
    this.listOficina = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  async getEstados(){
    this.listEstados = await firstValueFrom(this.estadoService.getEstados());
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
}
