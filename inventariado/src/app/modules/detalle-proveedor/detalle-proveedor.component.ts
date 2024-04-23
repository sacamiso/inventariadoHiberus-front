import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/core/model/proveedor.model';
import { ProveedorService } from 'src/app/core/services/proveedor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-proveedor',
  templateUrl: './detalle-proveedor.component.html',
  styleUrls: ['./detalle-proveedor.component.css']
})
export class DetalleProveedorComponent implements OnInit {

  proveedor: Proveedor | undefined;
  cargado = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private readonly proveedorService: ProveedorService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
   }

  ngOnInit(): void {
    this.cargaDatos();
  }

  cargaDatos() {
    this.getProveedor();
  }

  getProveedor() {
    this.proveedorService.getProveedorById(this.id).subscribe({
      next: (response) => {
        this.proveedor = response.message;
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

  irProveedores(){
    this.router.navigate([`gestion/proveedores`]);
  }
}
