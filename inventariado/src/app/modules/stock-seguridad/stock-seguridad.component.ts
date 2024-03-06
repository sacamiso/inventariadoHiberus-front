import { Component, OnInit } from '@angular/core';
import { StockSeguridad } from 'src/app/core/model/stock-seguridad.model';
import { Router } from '@angular/router';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';

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

  constructor(
    private readonly stockSeguridadService: StockSeguridadService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.stockSeguridadService.getStockSeguridadInterval(limit, skip).subscribe({
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
}
