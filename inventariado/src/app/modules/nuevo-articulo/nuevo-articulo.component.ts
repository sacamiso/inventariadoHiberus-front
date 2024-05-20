import { Component, OnInit } from '@angular/core';
import { Articulo, ArticuloForm } from 'src/app/core/model/articulo.model';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Categoria } from 'src/app/core/model/categoria.model';
import { Subcategoria, SubcategoriaList } from 'src/app/core/model/subcategoria.model';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { SubcategoriaService } from 'src/app/core/services/subcategoria.service';
import { ArticuloService } from 'src/app/core/services/articulo.service';

@Component({
  selector: 'app-nuevo-articulo',
  templateUrl: './nuevo-articulo.component.html',
  styleUrls: ['./nuevo-articulo.component.css']
})
export class NuevoArticuloComponent implements OnInit {

  msg: MesaggeResponseNumber | undefined;
  alertPlaceholder: HTMLElement | null;

  articulo: ArticuloForm = {
    descripcion: "",
    precioUnitario: null,
    referencia: "",
    codCategoria: "",
    codSubcategoria: "",
    iva: null,
    fabricante: "",
    modelo: "",
  }

  listCategorias: Array<Categoria> = [];
  listSubcategorias: Array<Subcategoria> = [];
  listAux: SubcategoriaList | undefined;

  cargado = false;
  cargadoCategoria = false;

  referenciaInvalida = false;
  descripcionInvalida = false;
  precioInvalido = false;
  categoriaInvalida = false;
  subcategoriaInvalida = false;
  ivaInvalido = false;
  fabricanteInvalido = false;
  modeloInvalido = false;

  constructor(
    private readonly router: Router,
    private readonly categoriaService: CategoriaService,
    private readonly subCateogriaService: SubcategoriaService,
    private readonly articuloService: ArticuloService,
  ) { 
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargarDatos1();
  }

  async cargarDatos1() {
    await this.getCategorias();
    this.cargado = true;
  }
  async getCategorias(){
    this.listCategorias = await firstValueFrom(this.categoriaService.getAllCategorias());
  }

  async changeCategoria(): Promise<void> {
    this.articulo.codSubcategoria = "";
    if(this.articulo.codCategoria !== "" && this.articulo.codCategoria!== null && this.articulo.codCategoria!== undefined) {
      this.categoriaInvalida = false;
      await this.cargarDatos2();
      this.cargadoCategoria = true;
      
    }else{
      this.cargadoCategoria = false;
    }
  }

  changeReferencia(){
    if(this.articulo.referencia !== "") {
      this.referenciaInvalida = false;
    }
  }

  changeDescripcion(){
    if(this.articulo.descripcion !== "") {
      this.descripcionInvalida = false;
    }
  }

  changePrecio(){
    if(this.articulo.precioUnitario !== null && this.articulo.precioUnitario >= 0) {
      this.precioInvalido = false;
    }
  }

  changeSubcategoria(){
    if(this.articulo.codSubcategoria !== "") {
      this.subcategoriaInvalida = false;
    }
  }

  changeIva(){
    if(this.articulo.iva !== null && this.articulo.iva >= 0) {
      this.ivaInvalido = false;
    }
  }

  changeFabricante(){
    if(this.articulo.fabricante !== "") {
      this.fabricanteInvalido = false;
    }
  }

  changeModelo(){
    if(this.articulo.modelo !== "") {
      this.modeloInvalido = false;
    }
  }

  async cargarDatos2() {
    await this.getSubcategoriaByCategoria(this.articulo.codCategoria);
  }

  async getSubcategoriaByCategoria(codCategoria: string){
    this.listAux = await firstValueFrom(this.subCateogriaService.getSubcategoriasByCategoria(codCategoria));
    if(this.listAux.success){
      this.listSubcategorias = this.listAux.message;
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

  guardarArticulo(){
    let pasavalidacion = true;
    if(this.articulo.referencia === ""){
      this.referenciaInvalida = true;
      pasavalidacion = false;
    }
    if(this.articulo.descripcion === ""){
      this.descripcionInvalida = true;
      pasavalidacion = false;
    }
    if(this.articulo.precioUnitario === null || this.articulo.precioUnitario < 0){
      this.precioInvalido = true;
      pasavalidacion = false;
    }
    if(this.articulo.codCategoria === ""){
      this.categoriaInvalida = true;
      pasavalidacion = false;
    }
    if(this.articulo.codSubcategoria === ""){
      this.subcategoriaInvalida = true;
      pasavalidacion = false;
    }
    if(this.articulo.iva === null || this.articulo.iva < 0){
      this.ivaInvalido = true;
      pasavalidacion = false;
    }
    if(this.articulo.fabricante === ""){
      this.fabricanteInvalido = true;
      pasavalidacion = false;
    }
    if(this.articulo.modelo === ""){
      this.modeloInvalido = true;
      pasavalidacion = false;
    }
    if(pasavalidacion){
      this.guardarFormulario();
    }
  }

  guardarFormulario(){
    this.articuloService.guardarArticulo(this.articulo).subscribe({
      next: (response) => {
        this.msg = response;
        if(this.msg.success){
          this.alerta('Artículo añadido con éxito', 'success');
          this.articulo = {
            descripcion: "",
            precioUnitario: null,
            referencia: "",
            codCategoria: "",
            codSubcategoria: "",
            iva: null,
            fabricante: "",
            modelo: "",
          }
          this.router.navigate([`gestion/articulos/articulo/${this.msg.message}`]);
        }else{
          this.alerta(this.msg.error, 'danger');
        }
      },
      error: (error) => {
        this.alerta(error.error.error, 'danger');
      }
    })
  }

  goBack() {
    this.router.navigate([`gestion/articulos`]);
  }
}
