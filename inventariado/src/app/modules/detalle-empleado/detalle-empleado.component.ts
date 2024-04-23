import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Empleado } from 'src/app/core/model/empleado.model';
import { EmpleadoService } from 'src/app/core/services/empleado.service';

@Component({
  selector: 'app-detalle-empleado',
  templateUrl: './detalle-empleado.component.html',
  styleUrls: ['./detalle-empleado.component.css']
})
export class DetalleEmpleadoComponent implements OnInit {

  empleado: Empleado | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly empleadoService: EmpleadoService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getEmpleado();
  }

  getEmpleado() {
    this.empleadoService.getEmpleadoById(this.id).subscribe({
      next: (response) => {
        this.empleado = response.message;
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
  
  irEmpleados(){
    this.router.navigate([`gestion/empleados`]);
  }
}
