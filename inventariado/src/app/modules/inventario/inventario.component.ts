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

  inventarios: Array<Inventario> = [];
  numeroInventarios: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listArticulos: Array<Articulo> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

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

}
