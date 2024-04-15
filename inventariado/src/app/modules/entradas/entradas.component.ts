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
    costeUnitarioMax:null
  }

  constructor(
    private location: Location,
    private readonly pedidoService: PedidoService,
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly empleadoService: EmpleadoService,
    private readonly condicionService: CondicionService,
    private readonly medioService: MedioService,
    private readonly proveedorService: ProveedorService
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
    this.cargarDatos();
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
      costeUnitarioMax:null
    }
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

}
