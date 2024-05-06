import { Component, OnInit } from '@angular/core';
import { Oficina } from 'src/app/core/model/oficina.model';
import { OficinaService } from '../../core/services/oficina.service';
import { StockSeguridadList } from 'src/app/core/model/stock-seguridad-list.model';
import { StockSeguridad, StockSeguridadForm } from 'src/app/core/model/stock-seguridad.model';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Categoria } from 'src/app/core/model/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { Subcategoria } from 'src/app/core/model/subcategoria.model';
import { SubcategoriaService } from '../../core/services/subcategoria.service';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';

@Component({
  selector: 'app-stock-seguridad-edit',
  templateUrl: './stock-seguridad-edit.component.html',
  styleUrls: ['./stock-seguridad-edit.component.css']
})
export class StockSeguridadEditComponent implements OnInit {

  listOficina: Array<Oficina> = [];
  idOficinaSeleccionada : number = 0;
  listCategorias: Array<Categoria> = [];
  listSubcategorias: Array<Subcategoria> = [];

  cargado1 = false;
  cargado2 = false;

  stockSeguridadResponse: StockSeguridadList | undefined;
  stockSeguridad: Array<StockSeguridadForm> = [];
  mensajeRepetido: string = '';
  repetido = false;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  constructor(
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly stockSeguridadService: StockSeguridadService,
    private readonly categoriaService: CategoriaService,
    private readonly subcategoriaService: SubcategoriaService,
  ) {
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    
    this.cargarDatos1();
  }

  async cargarDatos1() {
    await this.getOficinas();
    this.cargado1 = true;
  }

  async getOficinas(){
    this.listOficina = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  async changeOfi(): Promise<void> {
    if(this.idOficinaSeleccionada != 0 && this.idOficinaSeleccionada!= null && this.idOficinaSeleccionada!= undefined) {
      await this.cargarDatos2();
      
    }else{
      this.cargado2 = false;
    }
  }

  async cargarDatos2() {
    await this.getStockSeguridadByOficina(this.idOficinaSeleccionada);
    await this.getCategorias();
    await this.getSubcategorias();
    this.cargado2 = true;
  }

  async getCategorias(){
    this.listCategorias = await firstValueFrom(this.categoriaService.getAllCategorias());
  }

  async getSubcategorias(){
    this.listSubcategorias = await firstValueFrom(this.subcategoriaService.getAllSubcategorias());
  }

  async getStockSeguridadByOficina(idOf: number){
    this.stockSeguridadResponse = await firstValueFrom(this.stockSeguridadService.getStockSeguridadByOficina(idOf));
    this.stockSeguridad = this.stockSeguridadResponse.message;
  }
  eliminarLineaSS(ss: any) {
    const index = this.stockSeguridad.indexOf(ss);
    if (index !== -1) {
        this.stockSeguridad.splice(index, 1);
    }
}

  agregarFila() {
    this.stockSeguridad.push({
      codSubcategoria: "",
      codCategoria:"",
      idOficina: this.idOficinaSeleccionada,
      cantidad: 0,
      plazoEntregaMedio: 0
    });
  }

  isNumeroEnteroValido(n: any): boolean {
    return /^[0-9]*$/.test(n);
  }

  limpiarSeleccionSubcategoria(ss: any) {
    ss.codSubcategoria = "";
  }
  guardar(){
    if(this.stockSeguridad.length < 1){
      this.stockSeguridadService.vaciarStockSeguridad(this.idOficinaSeleccionada).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta(this.msg.message, 'success');
          }else{
            this.alerta(this.msg.error, 'danger');
          }
        },
        error: (error) => {
          console.log(error);
          this.alerta(error.error.error, 'danger');
        }
      })
    }else{
      this.stockSeguridadService.guardarStockSeguridad(this.stockSeguridad).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta(this.msg.message, 'success');
          }else{
            this.alerta(this.msg.error, 'danger');
          }
        },
        error: (error) => {
          console.log(error);
          this.alerta(error.error.error, 'danger');
        }
      })
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
  }

  validaCampos(){
    let correcto = true;
    this.repetido = false;
    const parejasUnicas = new Set<string>();

    this.stockSeguridad.forEach(elemento => {
      const pareja = elemento.codCategoria + '-' + elemento.codSubcategoria;

      if (parejasUnicas.has(pareja)) {
        correcto = false;
        this.repetido = true;
        this.mensajeRepetido = 'No se puede repetir la pareja Categoria y Subcategoria';
        return;
      }

      parejasUnicas.add(pareja);

      if(elemento.codCategoria === ""){
        correcto = false;
        return;
      }
      if(elemento.codSubcategoria === ""){
        correcto = false;
        return;
      }
      if(elemento.cantidad < 1 ||  !Number.isInteger(elemento.cantidad)){
        correcto = false;
        return;
      }
      if(elemento.plazoEntregaMedio < 1 ||  !Number.isInteger(elemento.plazoEntregaMedio)){
        correcto = false;
        return;
      }
    });
    return correcto;
  }

  goBack() {
    this.router.navigate([`gestion/stockSeguridad`]);
  }

  filteredOficinas: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

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
