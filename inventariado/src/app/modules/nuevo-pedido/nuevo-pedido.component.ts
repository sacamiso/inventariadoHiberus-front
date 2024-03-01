import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { Linea } from 'src/app/core/model/Linea.model';
import { firstValueFrom } from 'rxjs';
import { Pedido} from 'src/app/core/model/pedido.model';



@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  pedidoForm: FormGroup;

  //Para almacenar las líneas cuando se le de a guardar
  listLinea: Array<Linea> = [];
  //Para almacenar el pedido cuando se le da a guardar
  pedido: Pedido | undefined;

  listProveedor: Array<Proveedor> = [];
  listArticulos: Array<Articulo> = [];
  listOficina: Array<Oficina> = [];
  listEmpleado: Array<Empleado> = [];
  listMedioP: Array<Medio> = [];
  listCondicionP: Array<Condicion> = [];
 
  cargado = false;

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
      proveedor: null,
      empleado: null,
      oficina: null,
      medioPago: null,
      condicion: null,
      iva: null,
      plazoEntrega: null,
      costesEnvio: null,
      lineas: this.formBuilder.array([]) 
    });
    this.agregarLineaForm();
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargado = true;
  }

  get lineas() {
    return this.pedidoForm.controls["lineas"] as FormArray;
  }

  agregarLineaForm(){
    const lineasFormArray = this.formBuilder.group({
      articulo: null,
      uds: null,
      descuento: null,
    });
    this.lineas.push(lineasFormArray);
  }

  eliminarLineaForm(index: number){
    this.lineas.removeAt(index);
  }

  async cargarDatos() {
    await this.getArticulos();
    await this.getCondiciones();
    await this.getMedios();
    await this.getOficinas();
    await this.getEmpleados();
    await this.getProveedores();
  }

  
  
  guardar() {
    
  }

  

  async getCondiciones(){
    this.listCondicionP = await firstValueFrom(this.condicionService.getAllCondiciones());
  }

  async getMedios(){
    this.listMedioP = await firstValueFrom(this.medioService.getAllMedios());
  }

  async getEmpleados(){
    this.listEmpleado = await firstValueFrom(this.empleadoService.getAllEmpleados());
  }

  async getOficinas(){
    this.listOficina = await firstValueFrom(this.oficinaService.getAllOficinas());
  }
  async getArticulos(){
    this.listArticulos = await firstValueFrom(this.articuloService.getAllArticulos());
  }
  async getProveedores(){
    //En este caso no se puede emplear la estructura habitual de next, error, complete, ya que no podriamos hacer el await
    //De la siguiente manera soluciono el problema de la sincronía a la hora de cargar los datos en el fomulario
    this.listProveedor = await firstValueFrom(this.proveedorService.getAllProveedores());
  }

}
