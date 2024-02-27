import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Linea } from 'src/app/core/model/Linea.model';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { LineaService } from '../../core/services/linea.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {

  pedido: Pedido | undefined;
  lineas: Array<Linea> = [];
  existe = false;
  cargado = false;
  cargado2 = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly pedidoService: PedidoService,
    private readonly lineaService: LineaService,
    private location: Location
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    
    this.cargaDatos();

  }

  cargaDatos() {
    this.getPedido();
    this.listaLineas();
  }

  getPedido() {
    this.pedidoService.getPedidoById(this.id).subscribe({
    next: (response) => {
      this.pedido = response.message;
    },
    error: (error) => {
      console.log(error);
    },
    complete: () => {
      this.cargado = true;
    }
  })
  }

  listaLineas() {
    this.lineaService.getLineas(this.id).subscribe({
      next: (response) => {
        this.lineas = response.message;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado2 = true;
      }
    })
  }

}
