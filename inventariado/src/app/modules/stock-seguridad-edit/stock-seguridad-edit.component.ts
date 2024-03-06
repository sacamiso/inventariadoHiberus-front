import { Component, OnInit } from '@angular/core';
import { Oficina } from 'src/app/core/model/oficina.model';
import { OficinaService } from '../../core/services/oficina.service';
import { StockSeguridadList } from 'src/app/core/model/stock-seguridad-list.model';
import { StockSeguridad, StockSeguridadForm } from 'src/app/core/model/stock-seguridad.model';
import { StockSeguridadService } from '../../core/services/stock-seguridad.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-stock-seguridad-edit',
  templateUrl: './stock-seguridad-edit.component.html',
  styleUrls: ['./stock-seguridad-edit.component.css']
})
export class StockSeguridadEditComponent implements OnInit {

  listOficina: Array<Oficina> = [];
  idOficinaSeleccionada : number = 0;
  cargado1 = false;
  cargado2 = false;

  stockSeguridadResponse: StockSeguridadList | undefined;
  stockSeguridad: Array<StockSeguridadForm> = [];

  constructor(
    private readonly router: Router,
    private readonly oficinaService: OficinaService,
    private readonly stockSeguridadService: StockSeguridadService,
  ) { }

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
    if(this.idOficinaSeleccionada !== 0 && this.idOficinaSeleccionada!== null && this.idOficinaSeleccionada!== undefined) {
      await this.cargarDatos2();
      this.cargado2 = true;
    }else{
      this.cargado2 = false;
    }
  }

  async cargarDatos2() {
    await this.getStockSeguridadByOficina(this.idOficinaSeleccionada);
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
}
