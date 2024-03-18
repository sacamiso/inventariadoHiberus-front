import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HistorialList } from '../model/historial-list.model';
import { HistorialInventarioFiltros } from '../model/historial.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getHistorialInterval(limit: number, skip: number, filtros: HistorialInventarioFiltros): Observable<HistorialList> {
    return this.http.post<HistorialList>(`${this.apiUrl}/historialInventario/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }
}
