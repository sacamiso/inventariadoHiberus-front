import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Salida } from 'src/app/core/model/salida.model';
import { Router } from '@angular/router';
import { SalidaService } from '../../core/services/salida.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-salida',
  templateUrl: './detalle-salida.component.html',
  styleUrls: ['./detalle-salida.component.css']
})
export class DetalleSalidaComponent implements OnInit {

  salida: Salida | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly salidaService: SalidaService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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
}
