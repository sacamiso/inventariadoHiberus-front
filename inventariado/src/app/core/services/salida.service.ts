import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalidaList } from '../model/salida-list.model';
import { Salida, SalidaFiltros, SalidaForm } from '../model/salida.model';
import { MesaggeResponse } from '../model/mesagge-response.model';
import { SalidaMsg } from '../model/salida-msg.model';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getSalidasInterval(limit: number, skip: number, filtros: SalidaFiltros): Observable<SalidaList> {
    return this.http.post<SalidaList>(`${this.apiUrl}/salida/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  guardarSalida(salida: SalidaForm){
    return this.http.post<MesaggeResponse>(`${this.apiUrl}/salida/add`, salida);
  }

  getSalidaById(id: number): Observable<SalidaMsg> {
    return this.http.get<SalidaMsg>(`${this.apiUrl}/salida/${id}`);
  }

  getAllSalidas(): Observable<Array<Salida>> {
    return this.http.get<Array<Salida>>(`${this.apiUrl}/salida/listAll`);
  }
}
