import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadList, UnidadFiltros, UnidadEstado, UnidadForm } from '../model/unidad.model';
import { MesaggeResponse } from '../model/mesagge-response.model';
import { PedidoList } from 'src/app/core/model/pedido-list.model';
import { Articulo } from 'src/app/core/model/articulo.model';


@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  apiUrl = environment.API_URL;
  
  constructor(private readonly http: HttpClient) { }

  getUnidadesIntervalFilter(limit: number, skip: number, filtros: UnidadFiltros): Observable<UnidadList> {
    return this.http.post<UnidadList>(`${this.apiUrl}/unidad/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  editEstadoUnidad(unidad: UnidadEstado, id: number): Observable<MesaggeResponse> {
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/unidad/editar/${id}`, unidad);
  }

  getPedidosDisponible(idOficina: number, codArticulo: number): Observable<PedidoList> {
    return this.http.get<PedidoList>(`${this.apiUrl}/unidad/listPedidosDispParaUdsByOficinaAndArt?idOficina=${idOficina}&codArticulo=${codArticulo }`);
  }

  getArticulosDisponiblesByOficina(idOficina: number): Observable<Array<Articulo>> {
    return this.http.get<Array<Articulo>>(`${this.apiUrl}/unidad/listArtDiponiblesByOficina?idOficina=${idOficina}`);
  }

  guardarUnidad(unidad: UnidadForm){
    return this.http.post<MesaggeResponse>(`${this.apiUrl}/unidad/add`, unidad);
  }
}
