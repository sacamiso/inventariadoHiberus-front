import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Oficina } from 'src/app/core/model/oficina.model';
import { OficinaService } from 'src/app/core/services/oficina.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-detalle-oficina-public',
  templateUrl: './detalle-oficina-public.component.html',
  styleUrls: ['./detalle-oficina-public.component.css']
})
export class DetalleOficinaPublicComponent implements OnInit {

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

  irOficinas(){
    this.router.navigate([`gestion/oficinas`]);
  }

}
