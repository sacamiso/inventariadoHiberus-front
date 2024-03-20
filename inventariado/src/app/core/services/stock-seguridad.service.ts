import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockSeguridadList} from '../model/stock-seguridad-list.model';
import { StockSeguridadFiltros, StockSeguridadForm} from '../model/stock-seguridad.model';
import { MesaggeResponse } from '../model/mesagge-response.model';

@Injectable({
  providedIn: 'root'
})
export class StockSeguridadService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getStockSeguridadInterval(limit: number, skip: number, filtros: StockSeguridadFiltros): Observable<StockSeguridadList> {
    return this.http.post<StockSeguridadList>(`${this.apiUrl}/stockSeguridad/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  getStockSeguridadByOficina(idOficina: number): Observable<StockSeguridadList> {
    return this.http.get<StockSeguridadList>(`${this.apiUrl}/stockSeguridad/listOf/${idOficina}`);
  }

  guardarStockSeguridad(ss: Array<StockSeguridadForm>){
    return this.http.post<MesaggeResponse>(`${this.apiUrl}/stockSeguridad/save`, ss);
  }
}
