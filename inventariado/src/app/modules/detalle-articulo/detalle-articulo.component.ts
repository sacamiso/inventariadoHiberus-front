import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Articulo } from 'src/app/core/model/articulo.model';
import { ArticuloService } from 'src/app/core/services/articulo.service';

@Component({
  selector: 'app-detalle-articulo',
  templateUrl: './detalle-articulo.component.html',
  styleUrls: ['./detalle-articulo.component.css']
})
export class DetalleArticuloComponent implements OnInit {

  articulo: Articulo | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly articuloService: ArticuloService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getArticulo();
  }

  getArticulo() {
    this.articuloService.getArticuloById(this.id).subscribe({
      next: (response) => {
        this.articulo = response.message;
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

  irArticulos(){
    this.router.navigate([`gestion/articulos`]);
  }

  editar(){
    this.router.navigate([`gestion/edit/articulo/${this.id}`]);
  }
}
