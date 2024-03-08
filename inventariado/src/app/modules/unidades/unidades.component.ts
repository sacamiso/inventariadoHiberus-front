import { Component, OnInit } from '@angular/core';
import { Unidad, UnidadFiltros } from 'src/app/core/model/unidad.model';
import { Router } from '@angular/router';
import { UnidadService } from '../../core/services/unidad.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {

  unidades: Array<Unidad> = [];
  filtros: UnidadFiltros = {
    codEstado:"",
    numeroPedido: 0,
    idSalida: 0,
    idOficina: 0,
    codArticulo: 0,
  }
  numeroUnidades: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  constructor(
    private readonly unidadService: UnidadService,
    private readonly router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
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
}
