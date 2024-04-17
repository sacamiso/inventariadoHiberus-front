import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Asignacion } from 'src/app/core/model/asignacion.model';
import { AsignacionService } from 'src/app/core/services/asignacion.service';

@Component({
  selector: 'app-detalle-asignacion',
  templateUrl: './detalle-asignacion.component.html',
  styleUrls: ['./detalle-asignacion.component.css']
})
export class DetalleAsignacionComponent implements OnInit {

  asignacion: Asignacion | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly asignacionService: AsignacionService,
    private readonly router: Router,
    private location: Location
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getAsignacion();
  }

  getAsignacion() {
    this.asignacionService.getAsignacionById(this.id).subscribe({
      next: (response) => {
        this.asignacion = response.message;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  volver() {
    this.location.back();
  }

  detalleEmpleado(id: number){
    this.router.navigate([`gestion/empleados/empleado/${id}`]);
  }

  detalleUnidad(id: number){
    this.router.navigate([`gestion/unidades/unidad/${id}`]);
  }

  finalizarAsig(){
    
  }
}
