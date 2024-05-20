import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido } from 'src/app/core/model/pedido.model';
import { Linea } from 'src/app/core/model/Linea.model';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { LineaService } from '../../core/services/linea.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { Location } from '@angular/common';
import { Empleado } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';

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

  descargando: boolean = false;

  user: Empleado | null = null;
  isAdmin: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });

  constructor(
    private route: ActivatedRoute,
    private readonly pedidoService: PedidoService,
    private readonly lineaService: LineaService,
    private readonly router: Router,
    private location: Location,
    private authService: AuthService
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    
    this.cargaDatos();
    this.refreshHeader();
  }

  async refreshHeader() {
    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => { this.user = null; })
    this.isAdmin = this.authService.isAdmin;
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

  devolverPedido(){
    this.pedidoService.devolverPedido(this.id).subscribe({
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
        this.alerta(error.error.error, 'danger');
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

    // Establecer un temporizador para eliminar la alerta después de 20 segundos
    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 20000); // 20000 milisegundos = 20 segundos
  }

  goBack() {
    this.router.navigate([`entradas`]);
  }

  volver() {
    this.location.back();
  }

  descargarExcel() {
    this.descargando = true;
    this.pedidoService.descargarExcelByPedido(this.id).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombre = 'InformePedido'+this.id+'.xlsx';
        a.download = nombre;
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


  descargarPdf() {
    this.descargando = true;
    this.pedidoService.reporteJasperById(this.id).subscribe({
      next: (data: ArrayBuffer) => {
        if(data===null){
          this.alerta("Error al descargar el archivo PDF", 'danger');
          this.descargando = false;
          return;
        }else{
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const nombre = 'ReportePedido'+this.id+'.pdf';
          a.download = nombre;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          this.descargando = false;
        }
      },
      error: (error: any) => {
        this.alerta("Error al descargar el archivo PDF", 'danger');
        console.error('Error al descargar el archivo PDF:', error);
        this.descargando = false;
      }
    });
  }
}
