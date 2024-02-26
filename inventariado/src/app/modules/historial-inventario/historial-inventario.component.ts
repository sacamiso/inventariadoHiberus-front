import { Component, OnInit } from '@angular/core';
import { Historial } from 'src/app/core/model/historial.model';
import { Router } from '@angular/router';
import { HistorialService } from '../../core/services/historial.service';
import { Location } from '@angular/common';

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

  constructor(
    private readonly historialService: HistorialService,
    private readonly router: Router,
    private location: Location
    ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.historialService.getHistorialInterval(limit, skip).subscribe({
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

}
