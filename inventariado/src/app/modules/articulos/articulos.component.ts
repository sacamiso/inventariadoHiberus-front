import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Articulo, ArticuloFiltros } from 'src/app/core/model/articulo.model';
import { Categoria } from 'src/app/core/model/categoria.model';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { SubcategoriaService } from 'src/app/core/services/subcategoria.service';
import { Subcategoria } from 'src/app/core/model/subcategoria.model';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {

  articulos: Array<Articulo> = [];
  numeroArticulos: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listCategorias: Array<Categoria> = [];
  listSubcategorias: Array<Subcategoria> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: ArticuloFiltros = {
    descripcion: null,
    precioUnitarioMin: null,
    precioUnitarioMax:null,
    referencia:null,
    codigoCategoria:null,
    codigoSubcatogria: null,
    ivaMin: null,
    ivaMax:null,
    fabricante: null,
    modelo:null
  }

  constructor(
    private location: Location,
    private readonly articuloService: ArticuloService,
    private readonly router: Router,
    private readonly categoriaService: CategoriaService,
    private readonly subcategoriaService: SubcategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getCategorias();
    await this.getSubcategorias();
    this.filtrosCargados = true;
  }

  async getCategorias(){
    this.listCategorias = await firstValueFrom(this.categoriaService.getAllCategorias());
  }

  async getSubcategorias(){
    this.listSubcategorias = await firstValueFrom(this.subcategoriaService.getAllSubcategorias());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.articuloService.getArticulosInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.articulos = response.message;
        this.numeroArticulos = response.numTotal;
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


  crearNuevoArticulo(){
    this.router.navigate([`nuevo/articulo`]);
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
      descripcion: null,
    precioUnitarioMin: null,
    precioUnitarioMax:null,
    referencia:null,
    codigoCategoria:null,
    codigoSubcatogria: null,
    ivaMin: null,
    ivaMax:null,
    fabricante: null,
    modelo:null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }


}
