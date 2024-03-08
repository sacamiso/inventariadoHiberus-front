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

const routes: Routes = [
  {path: '', component:InventarioComponent},
  {path: 'avisos', component:AvisosComponent},
  {path: 'entradas', component:EntradasComponent},
  {path: 'entradas/pedido/:id', component:DetallePedidoComponent},
  {path: 'gestion', component:GestionComponent},
  {path: 'gestion/stockSeguridad', component:StockSeguridadComponent},
  {path: 'gestion/stockSeguridad/edit', component:StockSeguridadEditComponent},
  {path: 'gestion/unidades', component:UnidadesComponent},
  {path: 'historial', component:HistorialInventarioComponent},
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
