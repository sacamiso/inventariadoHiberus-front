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
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }


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
