import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MesaggeResponse, MesaggeResponseNumber } from '../model/mesagge-response.model';
import { AsignacionEdit, AsignacionFiltros, AsignacionForm, AsignacionList, AsignacionMsg } from '../model/asignacion.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAsignacionesInterval(limit: number, skip: number, filtros: AsignacionFiltros): Observable<AsignacionList> {
    return this.http.post<AsignacionList>(`${this.apiUrl}/asignacion/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  getAsignacionById(id: number): Observable<AsignacionMsg> {
    return this.http.get<AsignacionMsg>(`${this.apiUrl}/asignacion/${id}`);
  }

  guardarAsignacion(asignacion: AsignacionForm){
    return this.http.post<MesaggeResponseNumber>(`${this.apiUrl}/asignacion/add`, asignacion);
  }

  editarAsignacion(asignacion: AsignacionEdit, idAsignacion: number ){
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/asignacion/editar/${idAsignacion}`, asignacion);
  }

  finalizarAsignacion(idAsignacion: number): Observable<MesaggeResponse> {
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/asignacion/finalizar/${idAsignacion}`, null);
  }
}
