import { Component, OnInit } from '@angular/core';
import { StockSeguridad, StockSeguridadFiltros } from 'src/app/core/model/stock-seguridad.model';
import { Router } from '@angular/router';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Categoria } from 'src/app/core/model/categoria.model';
import { Subcategoria } from 'src/app/core/model/subcategoria.model';
import { OficinaService } from '../../core/services/oficina.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { SubcategoriaService } from '../../core/services/subcategoria.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-stock-seguridad',
  templateUrl: './stock-seguridad.component.html',
  styleUrls: ['./stock-seguridad.component.css']
})
export class StockSeguridadComponent implements OnInit {

  stockSeguridad: Array<StockSeguridad> = [];
  numeroSS: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listCategorias: Array<Categoria> = [];
  listsubcategorias: Array<Subcategoria> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: StockSeguridadFiltros = {
    idOficina: null,
    codCategoria: null,
    codSubcategoria: null,
    cantidad: null,
    plazoMin: null,
    plazoMax: null
  }
  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly categoriaService: CategoriaService,
    private readonly subcategoriaService: SubcategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getOficinas();
    await this.getCategorias();
    await this.getSubcategorias();
    this.filtrosCargados = true;
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }
  async getCategorias(){
    this.listCategorias = await firstValueFrom(this.categoriaService.getAllCategorias());
  }
  async getSubcategorias(){
    this.listsubcategorias = await firstValueFrom(this.subcategoriaService.getAllSubcategorias());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.stockSeguridadService.getStockSeguridadInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.stockSeguridad = response.message;
        this.numeroSS = response.numTotal;
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

  editarStockSeguridad(){
    this.router.navigate([`gestion/stockSeguridad/edit`]);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      idOficina: null,
      codCategoria: null,
      codSubcategoria: null,
      cantidad: null,
      plazoMin: null,
      plazoMax: null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }
}
