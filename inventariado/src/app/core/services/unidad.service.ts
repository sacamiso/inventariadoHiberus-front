import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadList, UnidadFiltros, UnidadEstado, UnidadForm, UnidadMsg, Unidad } from '../model/unidad.model';
import { MesaggeResponse, MesaggeResponseBoolean } from '../model/mesagge-response.model';
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

  getUnidadById(id: number): Observable<UnidadMsg> {
    return this.http.get<UnidadMsg>(`${this.apiUrl}/unidad/${id}`);
  }

  getUnidadesDisponibles(idOficina: number): Observable<UnidadList> {
    return this.http.get<UnidadList>(`${this.apiUrl}/unidad/listDisponibles/${idOficina}`);
  }

  estaAsignada(codInterno: number): Observable<MesaggeResponseBoolean> {
    return this.http.get<MesaggeResponseBoolean>(`${this.apiUrl}/unidad/asignada/${codInterno}`);
  }

  getUnidadesSinAsignarDisponiblesByOficina(id: number): Observable<UnidadList> {
    return this.http.get<UnidadList>(`${this.apiUrl}/unidad/listDisponiblesSinAsignar/${id}`);
  }
  
}
