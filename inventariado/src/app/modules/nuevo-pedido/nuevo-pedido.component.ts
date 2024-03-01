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
import { LineaForm } from 'src/app/core/model/Linea.model';
import { firstValueFrom } from 'rxjs';
import { PedidoForm} from 'src/app/core/model/pedido.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  pedidoForm: FormGroup;

  lineas: FormGroup[] = [];

  
  //Para almacenar el pedido cuando se le da a guardar
  pedido: PedidoForm = {
    ivaPedido: 0,
    idEmpleado: 0,
    plazoEntrega: 0,
    costesEnvio: 0,
    idProveedor: 0,
    idOficina: 0,
    condicionPago: '',
    medioPago: '',
    lineas: []
  };

  listProveedor: Array<Proveedor> = [];
  listArticulos: Array<Articulo> = [];
  listOficina: Array<Oficina> = [];
  listEmpleado: Array<Empleado> = [];
  listMedioP: Array<Medio> = [];
  listCondicionP: Array<Condicion> = [];
 
  cargado = false;

  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly empleadoService: EmpleadoService,
    private readonly condicionService: CondicionService,
    private readonly medioService: MedioService,
    private readonly oficinaService: OficinaService,
    private readonly articuloService: ArticuloService,
    private readonly proveedorService: ProveedorService,
    
  ) { 
    this.pedidoForm = this.formBuilder.group({
      idProveedor: null,
      idEmpleado: null,
      idOficina: null,
      medioPago: null,
      condicionPago: null,
      ivaPedido: null,
      plazoEntrega: null,
      costesEnvio: null
    });
    this.agregarLineaForm();
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargado = true;
  }

  agregarLineaForm(){
    const lineasFormArray = this.formBuilder.group({
      codigoArticulo: null,
      numeroUnidades: null,
      descuento: null,
    });
    this.lineas.push(lineasFormArray);
  }

  eliminarLineaForm(index: number){
    this.lineas.splice(index,1);
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

    if(this.pedidoForm.valid) {
      console.log("Entra a guardar");
      this.pedido = this.pedidoForm.getRawValue() as PedidoForm;

      for (let i = 0; i < this.lineas.length; i++) {
        const linea = this.lineas[i].value;
        console.log("linea");
        console.log(linea);
        
        this.pedido.lineas.push(linea); 
      }
      console.log(this.pedido );
    } else{
      console.log("No se pudo guardar");
    }
    console.log("Fin guardar");
  }

  volver(){
    this.router.navigate([`entradas`]);
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
