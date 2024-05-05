import { Component, OnInit } from '@angular/core';
import { Historial, HistorialInventarioFiltros } from 'src/app/core/model/historial.model';
import { Router } from '@angular/router';
import { HistorialService } from '../../core/services/historial.service';
import { Location } from '@angular/common';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { OficinaService } from '../../core/services/oficina.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-historial-inventario',
  templateUrl: './historial-inventario.component.html',
  styleUrls: ['./historial-inventario.component.css']
})
export class HistorialInventarioComponent implements OnInit {

  historiales: Array<Historial> = [];
  numeroHistoriales: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listArticulos: Array<Articulo> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  descargando: boolean = false;
  alertPlaceholder: HTMLElement | null;

  filtros: HistorialInventarioFiltros = {
    idOficina: 0,
    codArticulo: 0,
    stockMin: null,
    stockMax: null,
    fecha: null,
    fechaInicioIntervalo: null,
    fechaFinIntervalo: null
  }

  constructor(
    private readonly historialService: HistorialService,
    private readonly router: Router,
    private location: Location,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService
    ) { 
      this.alertPlaceholder = document.getElementById('liveAlert');
    }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getOficinas();
    await this.getArticulos();
    this.filtrosCargados = true;
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  async getArticulos(){
    this.listArticulos = await firstValueFrom(this.articuloService.getAllArticulos());
  }

  cargarPagina(pag: number) {
    
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    
    this.historialService.getHistorialInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.historiales = response.message;
        this.numeroHistoriales = response.numTotal;
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

  goBack() {
    this.location.back();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      idOficina: 0,
      codArticulo: 0,
      stockMin: null,
      stockMax: null,
      fecha: null,
      fechaInicioIntervalo: null,
      fechaFinIntervalo: null
    }
    this.selectedArticulo = undefined;
    this.lastSelectedArticulo = undefined;
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  descargarExcel() {
    this.descargando = true;
    this.historialService.descargarExcel( this.filtros).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'InformeHistorialInventario.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: (error: any) => {
        this.alerta("Error al descargar el archivo Excel", 'danger');
        console.error('Error al descargar el archivo Excel:', error);
        this.descargando = false;
      }
    });
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
