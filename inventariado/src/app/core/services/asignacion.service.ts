import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MesaggeResponse } from '../model/mesagge-response.model';
import { AsignacionFiltros, AsignacionList, AsignacionMsg } from '../model/asignacion.model';

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
}
