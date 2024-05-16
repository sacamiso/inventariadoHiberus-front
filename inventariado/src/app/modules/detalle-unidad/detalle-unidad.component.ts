import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Unidad } from 'src/app/core/model/unidad.model';
import { Router } from '@angular/router';
import { UnidadService } from '../../core/services/unidad.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Empleado } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-detalle-unidad',
  templateUrl: './detalle-unidad.component.html',
  styleUrls: ['./detalle-unidad.component.css']
})
export class DetalleUnidadComponent implements OnInit {

  unidad: Unidad | undefined;
  cargado = false;
  id: number;

  disponible: boolean | undefined;
  asignada: boolean | undefined;

  descargando: boolean = false;
  mensaje: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  user: Empleado | null = null;
  isAdmin: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });

  constructor(
    private route: ActivatedRoute,
    private readonly unidadService: UnidadService,
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
    this.getUnidad();
  }

  getUnidad() {
    this.unidadService.getUnidadById(this.id).subscribe({
      next: (response) => {
        this.unidad = response.message;
        this.cargaDatos2(this.unidad.idOficina);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  async cargaDatos2(idOficina: number){
    const disp = (await this.getDisponibles(idOficina)).message;

    for (let u of disp){
      if(u.codigoInterno === this.id){
        this.disponible = true;
      }
    }
    this.asignada = (await this.estaAsignada(this.id)).message;
    
    this.cargado = true;
  }

  async getDisponibles(idOficina: number){
    return await firstValueFrom(this.unidadService.getUnidadesDisponibles(idOficina));
  }

  async estaAsignada(codInterno: number){
    return await firstValueFrom(this.unidadService.estaAsignada(codInterno));
  }

  goBack() {
    this.router.navigate([`gestion/unidades`]);
  }

  detallePedido(id: number){
    this.router.navigate([`entradas/pedido/${id}`]);
  }

  detalleSalida(id: number){
    this.router.navigate([`salidas/salida/${id}`]);
  }

  volver() {
    this.location.back();
  }


  descargarExcel() {
    this.descargando = true;
    this.unidadService.descargarExcelByUnidad(this.id).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombre = 'InformeUnidad'+this.id+'.xlsx';
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
