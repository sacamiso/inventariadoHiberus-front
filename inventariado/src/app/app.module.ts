import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InventarioComponent } from './modules/inventario/inventario.component';
import { HistorialInventarioComponent } from './modules/historial-inventario/historial-inventario.component';
import { PaginadorComponent } from './modules/paginador/paginador.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './modules/menu/menu.component';
import { EntradasComponent } from './modules/entradas/entradas.component';
import { SalidasComponent } from './modules/salidas/salidas.component';
import { AvisosComponent } from './modules/avisos/avisos.component';
import { DetallePedidoComponent } from './modules/detalle-pedido/detalle-pedido.component';
import { NuevoPedidoComponent } from './modules/nuevo-pedido/nuevo-pedido.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevaSalidaComponent } from './modules/nueva-salida/nueva-salida.component';
import { FechaValidaDirective } from './core/directives/fecha-valida.directive';
import { DetalleSalidaComponent } from './modules/detalle-salida/detalle-salida.component';
import { GestionComponent } from './modules/gestion/gestion.component';
import { StockSeguridadComponent } from './modules/stock-seguridad/stock-seguridad.component';
import { StockSeguridadEditComponent } from './modules/stock-seguridad-edit/stock-seguridad-edit.component';
import { UnidadesComponent } from './modules/unidades/unidades.component';
import { NuevaUnidadComponent } from './modules/nueva-unidad/nueva-unidad.component';
import { DetalleUnidadComponent } from './modules/detalle-unidad/detalle-unidad.component';
import { InicioComponent } from './modules/inicio/inicio.component';
import { ArticulosComponent } from './modules/articulos/articulos.component';
import { NuevoArticuloComponent } from './modules/nuevo-articulo/nuevo-articulo.component';
import { ProveedoresComponent } from './modules/proveedores/proveedores.component';
import { NuevoProveedorComponent } from './modules/nuevo-proveedor/nuevo-proveedor.component';
import { EmpleadosComponent } from './modules/empleados/empleados.component';
import { NuevoEmpleadoComponent } from './modules/nuevo-empleado/nuevo-empleado.component';
import { OficinasComponent } from './modules/oficinas/oficinas.component';
import { NuevaOficinaComponent } from './modules/nueva-oficina/nueva-oficina.component';
import { DetalleProveedorComponent } from './modules/detalle-proveedor/detalle-proveedor.component';
import { DetalleArticuloComponent } from './modules/detalle-articulo/detalle-articulo.component';
import { DetalleOficinaComponent } from './modules/detalle-oficina/detalle-oficina.component';
import { DetalleEmpleadoComponent } from './modules/detalle-empleado/detalle-empleado.component';
import { AsignacionesComponent } from './modules/asignaciones/asignaciones.component';
import { DetalleAsignacionComponent } from './modules/detalle-asignacion/detalle-asignacion.component';


@NgModule({
  declarations: [
    AppComponent,
    InventarioComponent,
    HistorialInventarioComponent,
    PaginadorComponent,
    MenuComponent,
    EntradasComponent,
    SalidasComponent,
    AvisosComponent,
    DetallePedidoComponent,
    NuevoPedidoComponent,
    NuevaSalidaComponent,
    FechaValidaDirective,
    DetalleSalidaComponent,
    GestionComponent,
    StockSeguridadComponent,
    StockSeguridadEditComponent,
    UnidadesComponent,
    NuevaUnidadComponent,
    DetalleUnidadComponent,
    InicioComponent,
    ArticulosComponent,
    NuevoArticuloComponent,
    ProveedoresComponent,
    NuevoProveedorComponent,
    EmpleadosComponent,
    NuevoEmpleadoComponent,
    OficinasComponent,
    NuevaOficinaComponent,
    DetalleProveedorComponent,
    DetalleArticuloComponent,
    DetalleOficinaComponent,
    DetalleEmpleadoComponent,
    AsignacionesComponent,
    DetalleAsignacionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
