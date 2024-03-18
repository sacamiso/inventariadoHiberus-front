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

  filtros: HistorialInventarioFiltros = {
    idOficina: 0,
    codArticulo: 0,
    stockMin: null,
    stockMax: null,
    fecha: null
  }

  constructor(
    private readonly historialService: HistorialService,
    private readonly router: Router,
    private location: Location,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService
    ) { }

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
      fecha: null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

}
