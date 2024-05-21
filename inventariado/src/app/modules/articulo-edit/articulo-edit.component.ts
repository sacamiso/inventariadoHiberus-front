import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Articulo, ArticuloForm } from 'src/app/core/model/articulo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from 'src/app/core/services/articulo.service';
import { firstValueFrom } from 'rxjs';
import { MesaggeResponse } from 'src/app/core/model/mesagge-response.model';
import { Categoria } from 'src/app/core/model/categoria.model';
import { Subcategoria, SubcategoriaList } from 'src/app/core/model/subcategoria.model';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { SubcategoriaService } from 'src/app/core/services/subcategoria.service';

@Component({
  selector: 'app-articulo-edit',
  templateUrl: './articulo-edit.component.html',
  styleUrls: ['./articulo-edit.component.css']
})
export class ArticuloEditComponent implements OnInit {

  articulo: Articulo | undefined;
  cargado = false;
  id: number;


  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  listCategorias: Array<Categoria> = [];
  listSubcategorias: Array<Subcategoria> = [];
  listAux: SubcategoriaList | undefined;

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
    private route: ActivatedRoute,
    private readonly articuloService: ArticuloService,
    private readonly categoriaService: CategoriaService,
    private readonly subCateogriaService: SubcategoriaService,
    private readonly router: Router,
    private location: Location
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargaDatos1();
  }

  async cargaDatos1() {
    await this.getArticulo();
    await this.getCategorias();
    this.categoriaInvalida = false;
    await this.cargarDatos2();
    this.cargadoCategoria = true;
    this.cargado = true;
  }

  async getCategorias() {
    this.listCategorias = await firstValueFrom(this.categoriaService.getAllCategorias());
  }

  async getArticulo() {
    this.articulo = (await firstValueFrom(this.articuloService.getArticuloById(this.id))).message;
  }

  async changeCategoria(): Promise<void> {
    if (this.articulo) {
      this.articulo.codSubcategoria = "";
      if (this.articulo.codCategoria !== "" && this.articulo.codCategoria !== null && this.articulo.codCategoria !== undefined) {
        this.categoriaInvalida = false;
        await this.cargarDatos2();
        this.cargadoCategoria = true;

      } else {
        this.cargadoCategoria = false;
      }
    }

  }

  changeReferencia() {
    if (this.articulo?.referencia !== "") {
      this.referenciaInvalida = false;
    }
  }

  changeDescripcion() {
    if (this.articulo?.descripcion !== "") {
      this.descripcionInvalida = false;
    }
  }

  changePrecio() {
    if (this.articulo && this.articulo.precioUnitario !== null && this.articulo.precioUnitario >= 0) {
      this.precioInvalido = false;
    }
  }

  changeSubcategoria() {
    if (this.articulo && this.articulo.codSubcategoria !== "") {
      this.subcategoriaInvalida = false;
    }
  }

  changeIva() {
    if (this.articulo && this.articulo.iva !== null && this.articulo.iva >= 0) {
      this.ivaInvalido = false;
    }
  }

  changeFabricante() {
    if (this.articulo?.fabricante !== "") {
      this.fabricanteInvalido = false;
    }
  }

  changeModelo() {
    if (this.articulo?.modelo !== "") {
      this.modeloInvalido = false;
    }
  }

  async cargarDatos2() {
    if (this.articulo) {
      await this.getSubcategoriaByCategoria(this.articulo.codCategoria);
    }
  }

  async getSubcategoriaByCategoria(codCategoria: string) {
    this.listAux = await firstValueFrom(this.subCateogriaService.getSubcategoriasByCategoria(codCategoria));
    if (this.listAux.success) {
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

    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 5000);
  }

  guardarArticulo() {
    if (this.articulo) {
      let pasavalidacion = true;
      if (this.articulo.referencia === "") {
        this.referenciaInvalida = true;
        pasavalidacion = false;
      }
      if (this.articulo.descripcion === "") {
        this.descripcionInvalida = true;
        pasavalidacion = false;
      }
      if (this.articulo.precioUnitario === null || this.articulo.precioUnitario < 0) {
        this.precioInvalido = true;
        pasavalidacion = false;
      }
      if (this.articulo.codCategoria === "") {
        this.categoriaInvalida = true;
        pasavalidacion = false;
      }
      if (this.articulo.codSubcategoria === "") {
        this.subcategoriaInvalida = true;
        pasavalidacion = false;
      }
      if (this.articulo.iva === null || this.articulo.iva < 0) {
        this.ivaInvalido = true;
        pasavalidacion = false;
      }
      if (this.articulo.fabricante === "") {
        this.fabricanteInvalido = true;
        pasavalidacion = false;
      }
      if (this.articulo.modelo === "") {
        this.modeloInvalido = true;
        pasavalidacion = false;
      }
      if (pasavalidacion) {
        this.guardarFormulario();
      }
    }
  }

  guardarFormulario() {
    if (this.articulo) {
      this.articuloService.editarArticulo(this.articulo, this.id).subscribe({
        next: (response) => {
          this.msg = response;
          if (this.msg.success) {
            this.alerta('Artículo editado con éxito', 'success');

          } else {
            this.alerta(this.msg.error, 'danger');
          }
        },
        error: (error) => {
          this.alerta(error.error.error, 'danger');
        }
      })
    }

  }

  volver() {
    this.location.back();
  }
}
