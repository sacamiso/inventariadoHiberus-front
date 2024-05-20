import { Component, OnInit } from '@angular/core';
import { Unidad, UnidadFiltros, UnidadEstado } from 'src/app/core/model/unidad.model';
import { Router } from '@angular/router';
import { UnidadService } from '../../core/services/unidad.service';
import { Location } from '@angular/common';
import { Estado } from 'src/app/core/model/estado.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Salida } from 'src/app/core/model/salida.model';
import { OficinaService } from '../../core/services/oficina.service';
import { EstadoService } from '../../core/services/estado.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { SalidaService } from '../../core/services/salida.service';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {

  listOficinas: Array<Oficina> = [];
  listEstados: Array<Estado> = [];
  listArticulos: Array<Articulo> = [];
  listSalidas: Array<Salida> = [];
  unidades: Array<Unidad> = [];


  filtros: UnidadFiltros = {
    codEstado:"",
    fechaPedido: null,
    fechaSalida: null,
    idOficina: 0,
    codArticulo: 0,
    disponible: null
  }
  numeroUnidades: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  filtrosCargados = false;
  mostrarFiltros = false;

  selectedEstado: string = '';
  selectedSalida: number = 0;
  unidadSeleccionada: any;

  alertPlaceholder: HTMLElement | null;

  constructor(
    private readonly unidadService: UnidadService,
    private readonly router: Router,
    private location: Location,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
    private readonly estadoService: EstadoService,
    private readonly salidaService: SalidaService,
  ) { 
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
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

  async cargarDatos() {
    await this.getEstados();
    await this.getOficinas();
    await this.getArticulos();
    await this.getSalidas();
    this.filtrosCargados = true;
  }

  async getSalidas(){
    this.listSalidas = await firstValueFrom(this.salidaService.getAllSalidas());
  }
  async getArticulos(){
    this.listArticulos = await firstValueFrom(this.articuloService.getAllArticulos());
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  async getEstados(){
    this.listEstados = await firstValueFrom(this.estadoService.getEstados());
  }


  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaUnidadesMostrar(this.tamPag, this.pagina);
  }

  aplicarFiltros(){
    this.listaUnidadesMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      codEstado:"",
      fechaPedido: null,
      fechaSalida: null,
      idOficina: 0,
      codArticulo: 0,
      disponible: null
    }
    this.selectedArticulo = undefined;
    this.lastSelectedArticulo = undefined;
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.listaUnidadesMostrar(this.tamPag, this.pagina);
  }

  listaUnidadesMostrar(limit: number, skip: number) {
    this.unidadService.getUnidadesIntervalFilter(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.unidades = response.message;
        this.numeroUnidades = response.numTotal;
        
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  Multiplos5(total: number) {
    return Array.from({ length: total }, (_, i) => (i + 1) * 5); 
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros; // Cambia el estado de mostrarFiltros
  }

  
  saveEstado(unidadCod: number, estado:string) {
    let unidadUpd: UnidadEstado = {
      codEstado: estado,
      idSalida: this.selectedSalida
    };

    this.editEstado(unidadUpd,unidadCod);

    
    
  }

  editEstado(unidad: UnidadEstado, idUnidad: number) {
    this.unidadService.editEstadoUnidad(unidad,idUnidad).subscribe({
      next: (response) => {
        this.alerta(response.message, 'success');
        
      },
      error: (error) => {
        this.alerta(error.error.error , 'danger');
        this.selectedEstado = '';
        this.selectedSalida = 0;
      },
      complete: () => {
        //no entra aqui en caso de que sea error y debería por eso he repetido el código en error
        this.listaUnidadesMostrar(this.tamPag, this.pagina);
        this.selectedEstado = '';
        this.selectedSalida = 0;
      }
    })
  }
  
  registrarUnidad(){
    this.router.navigate([`gestion/unidades/nueva`]);
  }

  detalleUnidad(id: number){
    this.router.navigate([`gestion/unidades/unidad/${id}`]);
  }

  //cambios para el select autocompletable de filtro de artículos

  filteredArticulo: Array<Articulo> = [];
  selectedArticulo: Articulo | undefined;
  lastSelectedArticulo: Articulo | undefined;

  onSelectArticulo(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedArticulo = event;
    this.lastSelectedArticulo = event;
    this.filtros.codArticulo = event.codArticulo;
  }

  onClearArticulo() {
    if (this.lastSelectedArticulo){
      this.selectedArticulo = this.lastSelectedArticulo;
      this.filtros.codArticulo = this.lastSelectedArticulo.codigoArticulo;
    }  else {
      this.selectedArticulo = undefined; 
      this.filtros.codArticulo = 0;
    }
  }

  checkIfValidInputArticulo(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listArticulos.some(articulo => 
        this.getFullDescriptionArticulo(articulo).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearArticulo();
    }else{
      this.listArticulos.forEach(articulo => {
        if(this.getFullDescriptionArticulo(articulo).toLowerCase()===inputValue){
          this.selectedArticulo = articulo;
          this.filtros.codArticulo = articulo.codigoArticulo;
          this.lastSelectedArticulo = articulo;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionArticulo(articulo: Articulo) {
    return `${articulo.referencia}: ${articulo.descripcion}, ${articulo.precioUnitario}€`;
  }

  filterArticulo(event: any) {
    let query = event.query;
    this.filteredArticulo = this.listArticulos.filter(articulo => {
        const fullDescriptionArticulo = `${articulo.referencia}: ${articulo.descripcion}, ${articulo.precioUnitario}€`;
        return fullDescriptionArticulo.toLowerCase().includes(query.toLowerCase());
    });
  }

  //Fin cambios para el select autocompletable de filtro de artículos

  //cambios para el select autocompletable de filtro de oficinas

  filteredOficina: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.filtros.idOficina = event.idOficina;
  }

  onClearOficina() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.filtros.idOficina = this.lastSelectedOficina.idOficina;
    }  else {
      this.selectedOficina = undefined; 
      this.filtros.idOficina = 0;
    }
  }

  checkIfValidInputOficina(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listOficinas.some(oficina => 
        this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearOficina();
    }else{
      this.listOficinas.forEach(oficina => {
        if(this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue){
          this.selectedOficina = oficina;
          this.filtros.idOficina = oficina.idOficina;
          this.lastSelectedOficina = oficina;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionOficina(oficina: Oficina) {
    return `${oficina.direccion}, ${oficina.localidad}`;
  }

  filterOficina(event: any) {
    let query = event.query;
    this.filteredOficina = this.listOficinas.filter(oficina => {
        const fullDescriptionOficina = `${oficina.direccion}, ${oficina.localidad}`;
        return fullDescriptionOficina.toLowerCase().includes(query.toLowerCase());
    });
  }

  //Fin cambios para el select autocompletable de filtro de oficinas
}
