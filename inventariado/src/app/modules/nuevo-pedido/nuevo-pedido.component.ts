import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Articulo } from 'src/app/core/model/articulo.model';
import { Medio } from 'src/app/core/model/medio.model';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
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
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  pedidoForm: FormGroup;

  lineas: FormGroup[] = [];

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;
  
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
    private readonly pedidoService: PedidoService,
  ) { 
    this.pedidoForm = this.formBuilder.group({
      idProveedor: [null, Validators.required],
      idEmpleado: [null, Validators.required],
      idOficina: [null, Validators.required],
      medioPago: [null, Validators.required],
      condicionPago: [null, Validators.required],
      ivaPedido: [null, [Validators.required, Validators.min(0)]],
      plazoEntrega: [null, [Validators.required, Validators.pattern('^(-?\\d+)$'), Validators.min(1)]],
      costesEnvio: [null, [Validators.required, Validators.min(0)]],
    });
    this.agregarLineaForm();
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargado = true;
  }

  agregarLineaForm(){
    const lineasFormArray = this.formBuilder.group({
      codigoArticulo: [null, Validators.required],
      numeroUnidades: [1, [Validators.required, Validators.pattern('^(-?\\d+)$'), Validators.min(1)]],
      descuento: [0, [Validators.required, Validators.min(0)]],
    });
    this.lineas.push(lineasFormArray);
  }

  verificarValidezLineas() {
    let valido = true;
    this.lineas.forEach(linea => {
      if (!linea.valid) {
        valido = false;
      }
    });
    return valido;
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
    
    if (this.pedidoForm.invalid || !this.verificarValidezLineas()){
      this.alerta('El formulario no es válido', 'danger');
      return;
    }

    this.pedido = this.pedidoForm.getRawValue() as PedidoForm

    //Es necesario por la función anterior, ya que los campos que no están iniciados se ponen a null automáticos
    this.pedido.lineas = [];
    let lineaAux: LineaForm;
    for (let i = 0; i < this.lineas.length; i++) {
      const linea = this.lineas[i].value;

      lineaAux = {
        numeroLinea: i+1,
        codigoArticulo: linea.codigoArticulo,
        numeroUnidades: linea.numeroUnidades,
        descuento: linea.descuento
      }

      this.pedido.lineas.push(lineaAux); 
    }
    
    this.guardarFormulario();
  }

  guardarFormulario(){
    this.pedidoService.guardarPedido(this.pedido).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta(this.msg.message, 'success');
          this.pedidoForm.reset();
          this.lineas = [];
          this.agregarLineaForm();
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error, 'danger');
      }
    })
  }

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);
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
