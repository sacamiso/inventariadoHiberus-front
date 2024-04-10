import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Empleado, EmpleadoFiltros } from 'src/app/core/model/empleado.model';
import { Rol } from 'src/app/core/model/rol.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { EmpleadoService } from 'src/app/core/services/empleado.service';
import { RolService } from 'src/app/core/services/rol.service';
import { OficinaService } from 'src/app/core/services/oficina.service';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleados: Array<Empleado> = [];
  numeroEmpleados: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listRoles: Array<Rol> = [];
  listOficinas: Array<Oficina> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: EmpleadoFiltros = {
    dni:        null,
    nombre:     null,
    apellidos:  null,
    usuario:    null,
    codRol:     null,
    idOficina:  null,
  }

  constructor(
    private location: Location,
    private readonly empleadoService: EmpleadoService,
    private readonly router: Router,
    private readonly rolService: RolService,
    private readonly oficinaService: OficinaService
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getRoles();
    await this.getOficinas();
    this.filtrosCargados = true;
  }

  async getRoles(){
    this.listRoles = await firstValueFrom(this.rolService.getAllRoles());
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.empleadoService.getEmpleadosInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.empleados = response.message;
        this.numeroEmpleados = response.numTotal;
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

  crearNuevoEmpleado(){
    this.router.navigate([`gestion/empleados/nuevo`]);
  }

  goBack() {
    this.location.back();
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
      dni:        null,
      nombre:     null,
      apellidos:  null,
      usuario:    null,
      codRol:     null,
      idOficina:  null,
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }
}
