import { Component, OnInit } from '@angular/core';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Estado } from 'src/app/core/model/estado.model';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
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

  msg: MesaggeResponseNumber | undefined;
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

  oficinaInvalida = false;
  articuloInvalido = false;
  estadoInvalido = false;
  codigoInvalido = false;

  constructor(
    private readonly router: Router,
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
      this.oficinaInvalida = false;
      await this.cargarDatos2();
      this.cargado2 = true;
      
    }else{
      this.cargado2 = false;
    }
  }

  async changeArticulo(): Promise<void> {
    this.unidad.numeroPedido = null;
    if(this.codArticuloSeleccionado !== 0 && this.codArticuloSeleccionado!== null && this.codArticuloSeleccionado!== undefined) {
      this.articuloInvalido = false;
      await this.cargarDatos3();
      this.cargado3 = true;
    }else{
      this.cargado3 = false;
    }
  }

  changeEstado(){
    if(this.estadoSeleccionado !== "") {
      this.estadoInvalido = false;
    }
  }

  changeCodigo(){
    if(this.unidad.codigoInterno > 0) {
      this.codigoInvalido = false;
    }else{
      this.codigoInvalido = true;
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

  guardarUnidad(){
    
    let pasavalidacion = true;
    if(this.idOficinaSeleccionada === 0){
      this.oficinaInvalida = true;
      pasavalidacion = false;
    }
    if(this.codArticuloSeleccionado === 0){
      this.articuloInvalido = true;
      pasavalidacion = false;
    }
    if(this.estadoSeleccionado === ""){
      this.estadoInvalido = true;
      pasavalidacion = false;
    }
    if(this.unidad.codigoInterno < 1){
      this.codigoInvalido = true;
      pasavalidacion = false;
    }

    if(pasavalidacion){
      this.unidad.idOficina = this.idOficinaSeleccionada;
      this.unidad.codArticulo = this.codArticuloSeleccionado;
      this.unidad.codEstado = this.estadoSeleccionado;
      
      this.guardarFormulario();
    }
  }

  guardarFormulario(){
    this.unidadService.guardarUnidad(this.unidad).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta('Unidad registrada con éxito', 'success');
          this.router.navigate([`gestion/unidades/unidad/${this.msg.message}`]);
          this.unidad = {
            codigoInterno: 0,
            codEstado: "",
            numeroPedido:null,
            idOficina:0,
            codArticulo:0,
          }
          this.idOficinaSeleccionada = 0;
          this.codArticuloSeleccionado = 0;
          this.estadoSeleccionado = "";
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
  }

  goBack() {
    this.router.navigate([`gestion/unidades`]);
  }
}
