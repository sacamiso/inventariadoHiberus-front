import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Salida } from 'src/app/core/model/salida.model';
import { Router } from '@angular/router';
import { SalidaService } from '../../core/services/salida.service';
import { Location } from '@angular/common';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-detalle-salida',
  templateUrl: './detalle-salida.component.html',
  styleUrls: ['./detalle-salida.component.css']
})
export class DetalleSalidaComponent implements OnInit {

  salida: Salida | undefined;
  cargado = false;
  id: number;

  mensaje: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  descargando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private readonly salidaService: SalidaService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getSalida();
  }

  getSalida() {
    this.salidaService.getSalidaById(this.id).subscribe({
      next: (response) => {
        this.salida = response.message;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  goBack() {
    this.router.navigate([`salidas`]);
  }

  volver() {
    this.location.back();
  }

  descargarExcel() {
    this.descargando = true;
    this.salidaService.descargarExcelBySalida(this.id).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombre = 'InformeSalida'+this.id+'.xlsx';
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
