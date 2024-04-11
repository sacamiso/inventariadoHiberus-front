import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Oficina, OficinaFiltros } from 'src/app/core/model/oficina.model';
import { OficinaService } from 'src/app/core/services/oficina.service';

@Component({
  selector: 'app-oficinas',
  templateUrl: './oficinas.component.html',
  styleUrls: ['./oficinas.component.css']
})
export class OficinasComponent implements OnInit {

  oficinas: Array<Oficina> = [];
  numeroOficinas: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  mostrarFiltros = false;

  filtros: OficinaFiltros = {
    codigoPostal: null,
    direccion:    null,
    localidad:    null,
    provincia:    null,
    pais:         null,
  }

  constructor(
    private readonly oficinaService: OficinaService,
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
    this.oficinaService.getOficinasInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.oficinas = response.message;
        this.numeroOficinas = response.numTotal;
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

  crearNuevaOficina(){
    this.router.navigate([`gestion/oficinas/nueva`]);
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
      codigoPostal: null,
      direccion:    null,
      localidad:    null,
      provincia:    null,
      pais:         null,
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }
}
