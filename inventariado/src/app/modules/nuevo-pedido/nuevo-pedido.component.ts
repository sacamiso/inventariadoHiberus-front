import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Medio } from 'src/app/core/model/medio.model';
import { Condicion } from 'src/app/core/model/condicion.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { Empleado } from 'src/app/core/model/empleado.model';
import { Proveedor } from 'src/app/core/model/proveedor.model';
import { ProveedorService } from '../../core/services/proveedor.service';
import { ArticuloService } from '../../core/services/articulo.service';
import { OficinaService } from '../../core/services/oficina.service';
import { MedioService } from '../../core/services/medio.service';
import { CondicionService } from '../../core/services/condicion.service';
import { EmpleadoService } from '../../core/services/empleado.service';




@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  pedidoForm: FormGroup;

  listProveedor: Array<Proveedor> = [];
  cargado1 = false;
  listArticulos: Array<Articulo> = [];
  cargado2 = false;
  listOficina: Array<Oficina> = [];
  cargado3 = false;
  listEmpleado: Array<Empleado> = [];
  cargado4 = false;
  listMedioP: Array<Medio> = [];
  cargado5 = false;
  listCondicionP: Array<Condicion> = [];
  cargado6 = false;

  constructor(
    private formBuilder: FormBuilder,
    private readonly empleadoService: EmpleadoService,
    private readonly condicionService: CondicionService,
    private readonly medioService: MedioService,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
    private readonly proveedorService: ProveedorService,
    
  ) { 
    this.pedidoForm = this.formBuilder.group({
      title: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  cargarDatos() {
    this.getArticulos();
    this.getCondiciones();
    this.getMedios();
    this.getOficinas();
    this.getEmpleados();
    this.getProveedores();
  }

  getCondiciones(){

    this.condicionService.getAllCondiciones().subscribe({
      next: (response) => {
        this.listCondicionP = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado6 = true;
      }
    })

  }

  getMedios(){

    this.medioService.getAllMedios().subscribe({
      next: (response) => {
        this.listMedioP = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado5 = true;
      }
    })

  }

  getEmpleados(){

    this.empleadoService.getAllEmpleados().subscribe({
      next: (response) => {
        this.listEmpleado = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado4 = true;
      }
    })

  }

  getOficinas(){

    this.oficinaService.getAllOficinas().subscribe({
      next: (response) => {
        this.listOficina = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado3 = true;
      }
    })

  }
  getArticulos(){

    this.articuloService.getAllArticulos().subscribe({
      next: (response) => {
        this.listArticulos = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado2 = true;
      }
    })

  }
  getProveedores(){

    this.proveedorService.getAllProveedores().subscribe({
      next: (response) => {
        this.listProveedor = response;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado1 = true;
      }
    })

  }

  guardar() {
    
  }
}
