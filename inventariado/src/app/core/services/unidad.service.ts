import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadList, UnidadFiltros } from '../model/unidad.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  apiUrl = environment.API_URL;
  
  constructor(private readonly http: HttpClient) { }

  getUnidadesIntervalFilter(limit: number, skip: number, filtros: UnidadFiltros): Observable<UnidadList> {
    return this.http.post<UnidadList>(`${this.apiUrl}/unidad/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }
}
