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
import { Asignacion, AsignacionFiltros } from 'src/app/core/model/asignacion.model';
import { AsignacionService } from 'src/app/core/services/asignacion.service';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {

  asignaciones: Array<Asignacion> = [];
  numeroAsignaciones: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: AsignacionFiltros = {
    fechaInicio:  null,
    fechaFin:     null,
    dniEmpleado:  null,
    nombreEmpleado:  null,
    apellidosEmpleado: null,
    codOficinaEmpleado: null,
    codUnidad:  null,
    finalizadas: null,
  }
  constructor(
    private location: Location,
    private readonly asignacionService: AsignacionService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
  }

  async cargarDatos() {
    await this.getOficinas();
    this.filtrosCargados = true;
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.asignacionService.getAsignacionesInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.asignaciones = response.message;
        this.numeroAsignaciones = response.numTotal;
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

  crearNuevaAsignacion(){
    this.router.navigate([`gestion/asignaciones/nueva`]);
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
      fechaInicio:  null,
      fechaFin:     null,
      dniEmpleado:  null,
      nombreEmpleado:  null,
      apellidosEmpleado: null,
      codOficinaEmpleado: null,
      codUnidad:  null,
      finalizadas: null,
    }
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  detalleAsignacion(id: number){
    this.router.navigate([`gestion/asignaciones/asignacion/${id}`]);
  }

  //cambios para el select autocompletable de filtro de oficinas

  filteredOficina: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.filtros.codOficinaEmpleado = event.idOficina;
  }

  onClearOficina() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.filtros.codOficinaEmpleado = this.lastSelectedOficina.idOficina;
    }  else {
      this.selectedOficina = undefined; 
      this.filtros.codOficinaEmpleado = 0;
    }
  }

  checkIfValidInputOficina(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listOficinas.some(oficina => 
        this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearOficina();
    }else{
      this.listOficinas.forEach(oficina => {
        if(this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue){
          this.selectedOficina = oficina;
          this.filtros.codOficinaEmpleado = oficina.idOficina;
          this.lastSelectedOficina = oficina;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionOficina(oficina: Oficina) {
    return `${oficina.direccion}, ${oficina.localidad}`;
  }

  filterOficina(event: any) {
    let query = event.query;
    this.filteredOficina = this.listOficinas.filter(oficina => {
        const fullDescriptionOficina = `${oficina.direccion}, ${oficina.localidad}`;
        return fullDescriptionOficina.toLowerCase().includes(query.toLowerCase());
    });
  }

  //Fin cambios para el select autocompletable de filtro de oficinas
}
