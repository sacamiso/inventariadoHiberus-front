import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Oficina } from 'src/app/core/model/oficina.model';
import { OficinaService } from 'src/app/core/services/oficina.service';

@Component({
  selector: 'app-detalle-oficina',
  templateUrl: './detalle-oficina.component.html',
  styleUrls: ['./detalle-oficina.component.css']
})
export class DetalleOficinaComponent implements OnInit {

  oficina: Oficina | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly oficinaService: OficinaService,
    private readonly router: Router,
    private location: Location
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getOficina();
  }

  getOficina() {
    this.oficinaService.getOficinaById(this.id).subscribe({
      next: (response) => {
        this.oficina = response.message;
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
}
