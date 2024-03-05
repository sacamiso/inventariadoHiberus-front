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

const routes: Routes = [
  {path: '', component:InventarioComponent},
  {path: 'historial', component:HistorialInventarioComponent},
  {path: 'entradas', component:EntradasComponent},
  {path: 'entradas/pedido/:id', component:DetallePedidoComponent},
  {path: 'salidas', component:SalidasComponent},
  {path: 'salidas/nueva', component:NuevaSalidaComponent},
  {path: 'salidas/salida/:id', component:DetalleSalidaComponent},
  {path: 'avisos', component:AvisosComponent},
  {path: 'nuevo/pedido', component:NuevoPedidoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
