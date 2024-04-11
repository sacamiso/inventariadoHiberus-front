import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from 'src/app/modules/inventario/inventario.component';
import { HistorialInventarioComponent } from 'src/app/modules/historial-inventario/historial-inventario.component';
import { SalidasComponent } from 'src/app/modules/salidas/salidas.component';
import { EntradasComponent } from 'src/app/modules/entradas/entradas.component';
import { AvisosComponent } from 'src/app/modules/avisos/avisos.component';
import { DetallePedidoComponent } from 'src/app/modules/detalle-pedido/detalle-pedido.component';
import { NuevoPedidoComponent } from 'src/app/modules/nuevo-pedido/nuevo-pedido.component';
import { NuevaSalidaComponent } from 'src/app/modules/nueva-salida/nueva-salida.component';
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

const routes: Routes = [
  {path: '', component:InicioComponent},
  {path: 'avisos', component:AvisosComponent},
  {path: 'entradas', component:EntradasComponent},
  {path: 'entradas/pedido/:id', component:DetallePedidoComponent},
  {path: 'gestion', component:GestionComponent},
  {path: 'gestion/articulos', component:ArticulosComponent},
  {path: 'gestion/articulos/articulo/:id', component:DetalleArticuloComponent},
  {path: 'gestion/articulos/nuevo', component:NuevoArticuloComponent},
  {path: 'gestion/empleados', component:EmpleadosComponent},
  {path: 'gestion/empleados/empleado/:id', component:DetalleEmpleadoComponent},
  {path: 'gestion/empleados/nuevo', component:NuevoEmpleadoComponent},
  {path: 'gestion/oficinas', component:OficinasComponent},
  {path: 'gestion/oficinas/oficina/:id', component:DetalleOficinaComponent},
  {path: 'gestion/oficinas/nueva', component:NuevaOficinaComponent},
  {path: 'gestion/proveedores', component:ProveedoresComponent},
  {path: 'gestion/proveedores/proveedor/:id', component:DetalleProveedorComponent},
  {path: 'gestion/proveedores/nuevo', component:NuevoProveedorComponent},
  {path: 'gestion/stockSeguridad', component:StockSeguridadComponent},
  {path: 'gestion/stockSeguridad/edit', component:StockSeguridadEditComponent},
  {path: 'gestion/unidades', component:UnidadesComponent},
  {path: 'gestion/unidades/nueva', component:NuevaUnidadComponent},
  {path: 'gestion/unidades/unidad/:id', component:DetalleUnidadComponent},
  {path: 'historial', component:HistorialInventarioComponent},
  {path: 'inventario', component:InventarioComponent},
  {path: 'nuevo/pedido', component:NuevoPedidoComponent},
  {path: 'salidas', component:SalidasComponent},
  {path: 'salidas/nueva', component:NuevaSalidaComponent},
  {path: 'salidas/salida/:id', component:DetalleSalidaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
