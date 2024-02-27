import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';


@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {

  pedidos: Array<Pedido> = [];
  numeroPedidos: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  constructor(
    private readonly pedidoService: PedidoService,
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
    this.pedidoService.getPedidosInterval(limit, skip).subscribe({
      next: (response) => {
        this.pedidos = response.message;
        this.numeroPedidos = response.numTotal;
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
