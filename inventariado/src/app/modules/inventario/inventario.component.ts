import { Component, OnInit} from '@angular/core';
import { Inventario, InventarioFiltros} from 'src/app/core/model/inventario.model';
import { Router } from '@angular/router';
import { InventarioService } from '../../core/services/inventario.service';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { OficinaService } from '../../core/services/oficina.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  alertPlaceholder: HTMLElement | null;

  inventarios: Array<Inventario> = [];
  numeroInventarios: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listArticulos: Array<Articulo> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  descargando: boolean = false;

  filtros: InventarioFiltros = {
    idOficina: 0,
    codArticulo: 0,
    stockMin: null,
    stockMax: null
  }

  constructor(
    private readonly inventarioService: InventarioService,
    private readonly router: Router,
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
    this.inventarioService.getInventarioInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.inventarios = response.message;
        this.numeroInventarios = response.numTotal;
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

  verHistorial() {
    this.router.navigate(['historial']);
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
      stockMax: null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  detalleOficina(id: number){
    this.router.navigate([`gestion/oficinas/oficina/${id}`]);
  }

  descargarExcel() {
    this.descargando = true;
    this.inventarioService.descargarExcel( this.filtros).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'InformeInventarioAtcual.xlsx';
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

}
