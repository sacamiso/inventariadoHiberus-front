import { Component, OnInit } from '@angular/core';
import { Salida, SalidaFiltros } from 'src/app/core/model/salida.model';
import { Router } from '@angular/router';
import { SalidaService } from '../../core/services/salida.service';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { OficinaService } from '../../core/services/oficina.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {

  salidas: Array<Salida> = [];
  numeroSalidas: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listArticulos: Array<Articulo> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: SalidaFiltros = {
    numeroUnidades: null,
    costeTotalMin: null,
    costeTotalMax: null,
    costeUnitarioMin: null,
    costeUnitarioMax: null,
    fechaSalida:null,
    idOficina: null,
    codArticulo: null
  };
  constructor(
    private readonly salidaService: SalidaService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
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
    
    this.salidaService.getSalidasInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.salidas = response.message;
        this.numeroSalidas = response.numTotal;
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

  crearNuevaSalida(){
    this.router.navigate([`salidas/nueva`]);
  }

  detalleSalida(id: number){
    this.router.navigate([`salidas/salida/${id}`]);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      numeroUnidades: null,
      costeTotalMin: null,
      costeTotalMax: null,
      costeUnitarioMin: null,
      costeUnitarioMax: null,
      fechaSalida:null,
      idOficina: null,
      codArticulo: null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }
}
