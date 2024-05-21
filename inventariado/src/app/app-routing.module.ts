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
import { AsignacionesComponent } from './modules/asignaciones/asignaciones.component';
import { DetalleAsignacionComponent } from './modules/detalle-asignacion/detalle-asignacion.component';
import { NuevaAsignacionComponent } from './modules/nueva-asignacion/nueva-asignacion.component';
import { AsignacionEditComponent } from './modules/asignacion-edit/asignacion-edit.component';
import { LoginComponent } from './modules/login/login.component';
import { UsuarioLoggedGuard } from './core/guards/usuario-logged.guard';
import { UsuarioAdminGuard } from './core/guards/usuario-admin.guard';
import { DetalleOficinaPublicComponent } from './modules/detalle-oficina-public/detalle-oficina-public.component';
import { CambiarContrasenaComponent } from './modules/cambiar-contrasena/cambiar-contrasena.component';
import { EmpleadoEditComponent } from './modules/empleado-edit/empleado-edit.component';
import { OficinaEditComponent } from './modules/oficina-edit/oficina-edit.component';
import { ArticuloEditComponent } from './modules/articulo-edit/articulo-edit.component';

const routes: Routes = [
  {path: '', component:InicioComponent},
  {path: 'avisos', component:AvisosComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'cambiarContrasena', component:CambiarContrasenaComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'detalle/oficina/:id', component:DetalleOficinaPublicComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'entradas', component:EntradasComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'entradas/pedido/:id', component:DetallePedidoComponent , canActivate: [UsuarioLoggedGuard]},
  {path: 'gestion', component:GestionComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/articulos', component:ArticulosComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/articulos/articulo/:id', component:DetalleArticuloComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/edit/articulo/:id', component:ArticuloEditComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/articulos/nuevo', component:NuevoArticuloComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/asignaciones', component:AsignacionesComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/asignaciones/asignacion/:id', component:DetalleAsignacionComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/asignaciones/asignacion/edit/:id', component:AsignacionEditComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/asignaciones/nueva', component:NuevaAsignacionComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/empleados', component:EmpleadosComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/empleados/empleado/:id', component:DetalleEmpleadoComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/edit/empleado/:id', component:EmpleadoEditComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/empleados/nuevo', component:NuevoEmpleadoComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/oficinas', component:OficinasComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/oficinas/oficina/:id', component:DetalleOficinaComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/edit/oficina/:id', component:OficinaEditComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/oficinas/nueva', component:NuevaOficinaComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/proveedores', component:ProveedoresComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/proveedores/proveedor/:id', component:DetalleProveedorComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/proveedores/nuevo', component:NuevoProveedorComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/stockSeguridad', component:StockSeguridadComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/stockSeguridad/edit', component:StockSeguridadEditComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/unidades', component:UnidadesComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/unidades/nueva', component:NuevaUnidadComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'gestion/unidades/unidad/:id', component:DetalleUnidadComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'historial', component:HistorialInventarioComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'inventario', component:InventarioComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'nuevo/pedido', component:NuevoPedidoComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'salidas', component:SalidasComponent, canActivate: [UsuarioLoggedGuard]},
  {path: 'salidas/nueva', component:NuevaSalidaComponent, canActivate: [UsuarioAdminGuard]},
  {path: 'salidas/salida/:id', component:DetalleSalidaComponent, canActivate: [UsuarioLoggedGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
