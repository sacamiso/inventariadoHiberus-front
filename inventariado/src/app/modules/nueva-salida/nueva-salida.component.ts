import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
import { SalidaForm } from 'src/app/core/model/salida.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { InventarioService } from '../../core/services/inventario.service';
import { OficinaService } from '../../core/services/oficina.service';
import { SalidaService } from '../../core/services/salida.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { InventarioList } from 'src/app/core/model/inventario-list.model';
import {AutoCompleteModule} from 'primeng/autocomplete';



@Component({
  selector: 'app-nueva-salida',
  templateUrl: './nueva-salida.component.html',
  styleUrls: ['./nueva-salida.component.css']
})
export class NuevaSalidaComponent implements OnInit {

  salidaForm: FormGroup;

  msg: MesaggeResponseNumber | undefined;
  alertPlaceholder: HTMLElement | null;

  saldia: SalidaForm = {
    numUnidades: 0,
    costeTotal: 0,
    costeUnitario: 0,
    fechaSalida: new Date(),
    idOficina: 0,
    codArticulo: 0
  }

  listInventario: InventarioList | undefined;
  listOficina: Array<Oficina> = [];
  filteredOficinas: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  cargado1 = false;
  idOficinaSeleccionada : number = 0;
  cargado2 = false;
  
  costeUnitario : number = 0;


  constructor(
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private readonly oficinaService: OficinaService,
    private readonly inventarioService: InventarioService,
    private readonly salidaService: SalidaService,
  ) { 
    this.salidaForm = this.formBuilder.group({
      codArticulo: [null, Validators.required],
      fechaSalida: [null, Validators.required],
      numUnidades: [null, [Validators.required, Validators.pattern('^(-?\\d+)$'), Validators.min(1)]],
      costeTotal: [null, [Validators.required, Validators.min(0)]]
    });
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarDatos1();
  }

  async cargarDatos1() {
    await this.getOficinas();
    this.cargado1 = true;
  }

  
  async cargarDatos2() {
    await this.getAInventarioByOf(this.idOficinaSeleccionada);
  }

  async getOficinas(){
    this.listOficina = await firstValueFrom(this.oficinaService.getAllOficinas());
  }
  async getAInventarioByOf(idOf: number){
    this.listInventario = await firstValueFrom(this.inventarioService.getInventarioByOficina(idOf));
  }

  selectedItemId: any = null;

  getSelectedStock(): number {
      const selectedItem = this.listInventario?.message.find(item => item.codArticulo === this.selectedItemId);
      return selectedItem ? selectedItem.stock : 0;
  }

  resetNumUnidades(): void {
    this.salidaForm.get('numUnidades')?.setValue(null);
    this.actualizarCostoUnitario();
  }

  volver(){
    this.router.navigate([`salidas`]);
  }

  actualizarCostoUnitario() {
    if (this.salidaForm.get('costeTotal')?.valid && this.salidaForm.get('numUnidades')?.valid) {
      this.costeUnitario = this.salidaForm.value.costeTotal / this.salidaForm.value.numUnidades;
    } else {
      this.costeUnitario = 0;
    }
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

  guardar() {
    if (this.salidaForm.invalid){
      this.alerta('El formulario no es válido', 'danger');
      return;
    }

    this.saldia = this.salidaForm.getRawValue() as SalidaForm;

    this.saldia.idOficina = this.idOficinaSeleccionada;
    this.saldia.costeUnitario = this.saldia.costeTotal / this.saldia.numUnidades;

    this.guardarFormulario();
  }

  guardarFormulario(){
    this.salidaService.guardarSalida(this.saldia).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta('Salida añadida con éxito', 'success');
          this.salidaForm.reset();
          this.idOficinaSeleccionada = 0;
          this.router.navigate([`salidas/salida/${this.msg.message}`]);
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
  }

  async changeOfi(): Promise<void> {
    this.salidaForm.reset();
    if(this.idOficinaSeleccionada != 0 && this.idOficinaSeleccionada!= null && this.idOficinaSeleccionada!= undefined) {
      await this.cargarDatos2();
      this.cargado2 = true;
    }else{
      this.cargado2 = false;
    }
  }

  filterOficina(event: any) {
    let query = event.query;
    this.filteredOficinas = this.listOficina.filter(oficina => {
        const fullDescription = `${oficina.direccion}, ${oficina.localidad}`;
        return fullDescription.toLowerCase().includes(query.toLowerCase());
    });
  }

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.idOficinaSeleccionada = event.idOficina;
    this.changeOfi();
  }

  onClear() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.idOficinaSeleccionada = this.lastSelectedOficina.idOficina;
    }  else {
      this.selectedOficina = undefined; 
      this.idOficinaSeleccionada = 0;
    }
    this.changeOfi();
  }

  getFullDescription(oficina: Oficina) {
    return `${oficina.direccion}, ${oficina.localidad}`;
  }

  checkIfValidInput(event: KeyboardEvent) {

    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listOficina.some(oficina => 
        this.getFullDescription(oficina).toLowerCase()===inputValue,
    );

    if (!match) {
      this.onClear();
    }else{
      this.listOficina.forEach(oficina => {
        if(this.getFullDescription(oficina).toLowerCase()===inputValue){
          this.selectedOficina = oficina;
          this.idOficinaSeleccionada = oficina.idOficina;
          this.lastSelectedOficina = oficina;
          this.changeOfi();
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }
}
