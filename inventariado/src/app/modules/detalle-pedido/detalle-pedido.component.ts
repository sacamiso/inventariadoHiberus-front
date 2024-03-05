import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Linea } from 'src/app/core/model/Linea.model';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { LineaService } from '../../core/services/linea.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';


@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {

  pedido: Pedido | undefined;
  lineas: Array<Linea> = [];
  cargado = false;
  cargado2 = false;
  id: number;

  mensaje: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  constructor(
    private route: ActivatedRoute,
    private readonly pedidoService: PedidoService,
    private readonly lineaService: LineaService,
    private readonly router: Router
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alertPlaceholder = document.getElementById('liveAlert');
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


  marcarRecibido(){
    this.pedidoService.marcarRecibido(this.id).subscribe({
      next: (response) => {
        this.mensaje = response;
        if(this.mensaje.success){
          this.alerta(this.mensaje.message, 'success');
        }else{
          this.alerta(this.mensaje.error, 'success');
        }
        
      },
      error: (error) => {
        console.log(error);
        this.alerta("No se ha podido marcar como recibido", 'danger');
      },
      complete: () => {
        this.cargaDatos();
      }
    })
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

  goBack() {
    this.router.navigate([`entradas`]);
  }
}
