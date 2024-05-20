import { Component, OnInit } from '@angular/core';
import { Salida, SalidaFiltros } from 'src/app/core/model/salida.model';
import { Router } from '@angular/router';
import { SalidaService } from '../../core/services/salida.service';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';
import { OficinaService } from '../../core/services/oficina.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Empleado } from 'src/app/core/model/empleado.model';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {

  alertPlaceholder: HTMLElement | null;

  salidas: Array<Salida> = [];
  numeroSalidas: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listArticulos: Array<Articulo> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  descargando: boolean = false;

  filtros: SalidaFiltros = {
    numeroUnidades: null,
    costeTotalMin: null,
    costeTotalMax: null,
    costeUnitarioMin: null,
    costeUnitarioMax: null,
    fechaSalida:null,
    idOficina: null,
    codArticulo: null,
    fechaInicioIntervalo: null,
    fechaFinIntervalo: null
  };

  user: Empleado | null = null;
  isAdmin: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });

  constructor(
    private readonly salidaService: SalidaService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
    private authService: AuthService
  ) { 
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
    this.refreshHeader();
  }

  async refreshHeader() {
    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => { this.user = null; })
    this.isAdmin = this.authService.isAdmin;
  }

  async cargarDatos() {
    await this.getOficinas();
    await this.getArticulos();
    this.filtrosCargados = true;
  }
  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }
  async getArticulos(){
    this.listArticulos = await firstValueFrom(this.articuloService.getAllArticulos());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    
    this.salidaService.getSalidasInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.salidas = response.message;
        this.numeroSalidas = response.numTotal;
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

  crearNuevaSalida(){
    this.router.navigate([`salidas/nueva`]);
  }

  detalleSalida(id: number){
    this.router.navigate([`salidas/salida/${id}`]);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      numeroUnidades: null,
      costeTotalMin: null,
      costeTotalMax: null,
      costeUnitarioMin: null,
      costeUnitarioMax: null,
      fechaSalida:null,
      idOficina: null,
      codArticulo: null,
      fechaInicioIntervalo: null,
      fechaFinIntervalo: null
    }
    this.selectedArticulo = undefined;
    this.lastSelectedArticulo = undefined;
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  descargarExcel() {
    this.descargando = true;
    this.salidaService.descargarExcel( this.filtros).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'InformeSalidas.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        this.descargando = false;
      },
      error: (error: any) => {
        this.alerta("Error al descargar el archivo Excel", 'danger');
        console.error('Error al descargar el archivo Excel:', error);
        this.descargando = false;
      }
    });
  }

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);

    // Establecer un temporizador para eliminar la alerta después de 20 segundos
    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 20000); // 20000 milisegundos = 20 segundos
  }


  //cambios para el select autocompletable de filtro de artículos

  filteredArticulo: Array<Articulo> = [];
  selectedArticulo: Articulo | undefined;
  lastSelectedArticulo: Articulo | undefined;

  onSelectArticulo(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedArticulo = event;
    this.lastSelectedArticulo = event;
    this.filtros.codArticulo = event.codArticulo;
  }

  onClearArticulo() {
    if (this.lastSelectedArticulo){
      this.selectedArticulo = this.lastSelectedArticulo;
      this.filtros.codArticulo = this.lastSelectedArticulo.codigoArticulo;
    }  else {
      this.selectedArticulo = undefined; 
      this.filtros.codArticulo = 0;
    }
  }

  checkIfValidInputArticulo(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listArticulos.some(articulo => 
        this.getFullDescriptionArticulo(articulo).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearArticulo();
    }else{
      this.listArticulos.forEach(articulo => {
        if(this.getFullDescriptionArticulo(articulo).toLowerCase()===inputValue){
          this.selectedArticulo = articulo;
          this.filtros.codArticulo = articulo.codigoArticulo;
          this.lastSelectedArticulo = articulo;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionArticulo(articulo: Articulo) {
    return `${articulo.referencia}: ${articulo.descripcion}, ${articulo.precioUnitario}€`;
  }

  filterArticulo(event: any) {
    let query = event.query;
    this.filteredArticulo = this.listArticulos.filter(articulo => {
        const fullDescriptionArticulo = `${articulo.referencia}: ${articulo.descripcion}, ${articulo.precioUnitario}€`;
        return fullDescriptionArticulo.toLowerCase().includes(query.toLowerCase());
    });
  }

  //Fin cambios para el select autocompletable de filtro de artículos

  //cambios para el select autocompletable de filtro de oficinas

  filteredOficina: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.filtros.idOficina = event.idOficina;
  }

  onClearOficina() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.filtros.idOficina = this.lastSelectedOficina.idOficina;
    }  else {
      this.selectedOficina = undefined; 
      this.filtros.idOficina = 0;
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
          this.filtros.idOficina = oficina.idOficina;
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
