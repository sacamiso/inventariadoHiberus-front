import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Unidad } from 'src/app/core/model/unidad.model';
import { Router } from '@angular/router';
import { UnidadService } from '../../core/services/unidad.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private readonly unidadService: UnidadService,
    private readonly router: Router,
    private location: Location
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargaDatos();
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
}
