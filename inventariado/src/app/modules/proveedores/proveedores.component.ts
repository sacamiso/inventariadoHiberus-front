import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Proveedor, ProveedorFiltros } from 'src/app/core/model/proveedor.model';
import { ProveedorService } from 'src/app/core/services/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores: Array<Proveedor> = [];
  numeroProveedores: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  mostrarFiltros = false;

  filtros: ProveedorFiltros = {
    cif:          null,
    razonSocial:  null,
    direccion:    null,
    codigoPostal: null,
    localidad:    null,
    telefono:     null,
    email:        null,
  }

  constructor(
    private readonly proveedorService: ProveedorService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.proveedorService.getProveedoresInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.proveedores = response.message;
        this.numeroProveedores = response.numTotal;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  Multiplos5(total: number) {
    return Array.from({ length: total }, (_, i) => (i + 1) * 5); 
  }

  crearNuevoProveedor(){
    this.router.navigate([`gestion/proveedores/nuevo`]);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.trimStringProperties(this.filtros);
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  trimStringProperties(obj: any) {
    for (const prop in obj) {
        if (typeof obj[prop] === 'string') {
            if (obj[prop].trim() === '') {
                obj[prop] = null;
            } else {
                obj[prop] = obj[prop].trim();
            }
        }
    }
  }

  limpiarFiltros(){
    this.filtros = {
      cif:          null,
      razonSocial:  null,
      direccion:    null,
      codigoPostal: null,
      localidad:    null,
      telefono:     null,
      email:        null,
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }
}
