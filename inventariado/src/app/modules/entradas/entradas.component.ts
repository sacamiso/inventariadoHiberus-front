import { Component, OnInit } from '@angular/core';
import { Pedido, PedidoFiltros } from 'src/app/core/model/pedido.model';
import { Router } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { Empleado } from 'src/app/core/model/empleado.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Proveedor } from 'src/app/core/model/proveedor.model';
import { Condicion } from 'src/app/core/model/condicion.model';
import { Medio } from 'src/app/core/model/medio.model';
import { EmpleadoService } from '../../core/services/empleado.service';
import { OficinaService } from '../../core/services/oficina.service';
import { ProveedorService } from '../../core/services/proveedor.service';
import { CondicionService } from '../../core/services/condicion.service';
import { MedioService } from '../../core/services/medio.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css']
})
export class EntradasComponent implements OnInit {

  pedidos: Array<Pedido> = [];
  numeroPedidos: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  listOficinas: Array<Oficina> = [];
  listEmpleados: Array<Empleado> = [];
  listProveedores: Array<Proveedor> = [];
  listCondiciones: Array<Condicion> = [];
  listMedios: Array<Medio> = [];

  filtrosCargados = false;
  mostrarFiltros = false;

  filtros: PedidoFiltros = {
    fechaPedido: null,
    ivaPedidoMin: null,
    ivaPedidoMax:null,
    costeTotalMin:null,
    costeTotalMax:null,
    idEmpleado: null,
    plazoEntregaMin: null,
    plazoEntregaMax:null,
    costesEnvioMin: null,
    costesEnvioMax:null,
    idProveedor:null,
    idOficina:null,
    fechaRecepcion: null,
    codigoCondicionPago: null,
    codigoMedioPago:null,
    recibido:null,
    devuelto:null,
    costeUnitarioMin:null,
    costeUnitarioMax:null,
    fechaInicioIntervalo: null,
    fechaFinIntervalo: null
  }

  alertPlaceholder: HTMLElement | null;
  descargando: boolean = false;

  user: Empleado | null = null;
  isAdmin: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });

  constructor(
    private location: Location,
    private readonly pedidoService: PedidoService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly empleadoService: EmpleadoService,
    private readonly condicionService: CondicionService,
    private readonly medioService: MedioService,
    private readonly proveedorService: ProveedorService,
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
    await this.getEmpleados();
    await this.getProveedores();
    await this.getCondiciones();
    await this.getMedios();
    this.filtrosCargados = true;
  }

  async getMedios(){
    this.listMedios = await firstValueFrom(this.medioService.getAllMedios());
  }

  async getCondiciones(){
    this.listCondiciones = await firstValueFrom(this.condicionService.getAllCondiciones());
  }

  async getProveedores(){
    this.listProveedores = await firstValueFrom(this.proveedorService.getAllProveedores());
  }

  async getEmpleados(){
    this.listEmpleados = await firstValueFrom(this.empleadoService.getAllEmpleados());
  }
  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.pedidoService.getPedidosInterval(limit, skip, this.filtros).subscribe({
      next: (response) => {
        this.pedidos = response.message;
        this.numeroPedidos = response.numTotal;
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

  detallePedido(id: number){
    this.router.navigate([`entradas/pedido/${id}`]);
  }

  crearNuevoPedido(){
    this.router.navigate([`nuevo/pedido`]);
  }

  goBack() {
    this.location.back();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros(){
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  limpiarFiltros(){
    this.filtros = {
      fechaPedido: null,
      ivaPedidoMin: null,
      ivaPedidoMax:null,
      costeTotalMin:null,
      costeTotalMax:null,
      idEmpleado: null,
      plazoEntregaMin: null,
      plazoEntregaMax:null,
      costesEnvioMin: null,
      costesEnvioMax:null,
      idProveedor:null,
      idOficina:null,
      fechaRecepcion: null,
      codigoCondicionPago: null,
      codigoMedioPago:null,
      recibido:null,
      devuelto:null,
      costeUnitarioMin:null,
      costeUnitarioMax:null,
      fechaInicioIntervalo: null,
      fechaFinIntervalo: null
    }
    this.selectedOficina = undefined;
    this.lastSelectedOficina = undefined;
    this.selectedEmpleado = undefined;
    this.lastSelectedEmpleado = undefined;
    this.selectedProveedor = undefined;
    this.lastSelectedProveedor = undefined;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  descargarExcel() {
    this.descargando = true;
    this.pedidoService.descargarExcel( this.filtros).subscribe({
      next: (data: ArrayBuffer) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'InformeEntradas.xlsx';
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

  //cambios para el select autocompletable de filtro de empleado
  
  filteredEmpleado: Array<Empleado> = [];
  selectedEmpleado: Empleado | undefined;
  lastSelectedEmpleado: Empleado | undefined;

  onSelectEmpleado(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedEmpleado = event;
    this.lastSelectedEmpleado = event;
    this.filtros.idEmpleado = event.idEmpleado;
  }

  onClearEmpleado() {
    if (this.lastSelectedEmpleado){
      this.selectedEmpleado = this.lastSelectedEmpleado;
      this.filtros.idEmpleado = this.lastSelectedEmpleado.idEmpleado;
    }  else {
      this.selectedEmpleado = undefined; 
      this.filtros.idEmpleado = 0;
    }
  }

  checkIfValidInputEmpleado(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listEmpleados.some(empleado => 
        this.getFullDescriptionEmpleado(empleado).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearEmpleado();
    }else{
      this.listEmpleados.forEach(empleado => {
        if(this.getFullDescriptionEmpleado(empleado).toLowerCase()===inputValue){
          this.selectedEmpleado = empleado;
          this.filtros.idEmpleado = empleado.idEmpleado;
          this.lastSelectedEmpleado = empleado;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionEmpleado(empleado: Empleado) {
    return `${empleado.nombre} ${empleado.apellidos}, ${empleado.dni}`;
  }

  filterEmpleado(event: any) {
    let query = event.query;
    this.filteredEmpleado = this.listEmpleados.filter(empleado => {
        const fullDescriptionEmpleado = `${empleado.nombre} ${empleado.apellidos}, ${empleado.dni}`;
        return fullDescriptionEmpleado.toLowerCase().includes(query.toLowerCase());
    });
  }
  //Fin cambios para el select autocompletable de filtro de empleado

  //cambios para el select autocompletable de filtro de proveedor

  filteredProveedor: Array<Proveedor> = [];
  selectedProveedor: Proveedor | undefined;
  lastSelectedProveedor: Proveedor | undefined;

  onSelectProveedor(event: any) {
    this.selectedProveedor = event;
    this.lastSelectedProveedor = event;
    this.filtros.idProveedor = event.idProveedor;
  }

  onClearProveedor() {
    if (this.lastSelectedProveedor){
      this.selectedProveedor = this.lastSelectedProveedor;
      this.filtros.idProveedor = this.lastSelectedProveedor.idProveedor;
    }  else {
      this.selectedProveedor = undefined; 
      this.filtros.idProveedor = 0;
    }
  }

  checkIfValidInputProveedor(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    const match = this.listProveedores.some(proveedor => 
        this.getFullDescriptionProveedor(proveedor).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearProveedor();
    }else{
      this.listProveedores.forEach(proveedor => {
        if(this.getFullDescriptionProveedor(proveedor).toLowerCase()===inputValue){
          this.selectedProveedor = proveedor;
          this.filtros.idProveedor = proveedor.idProveedor;
          this.lastSelectedProveedor = proveedor;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionProveedor(proveedor: Proveedor) {
    return `${proveedor.razonSocial}`;
  }

  filterProveedor(event: any) {
    let query = event.query;
    this.filteredProveedor = this.listProveedores.filter(proveedor => {
        const fullDescriptionProveedor = `${proveedor.razonSocial}`;
        return fullDescriptionProveedor.toLowerCase().includes(query.toLowerCase());
    });
  }
  //Fin cambios para el select autocompletable de filtro de proveedor
}
