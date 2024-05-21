import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oficina, OficinaFiltros, OficinaForm, OficinaList, OficinaMsg } from '../model/oficina.model';
import { MesaggeResponse, MesaggeResponseNumber } from '../model/mesagge-response.model';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllOficinas(): Observable<Array<Oficina>> {
    return this.http.get<Array<Oficina>>(`${this.apiUrl}/oficina/listAll`);
  }

  getOficinasInterval(limit: number, skip: number, filtros: OficinaFiltros): Observable<OficinaList> {
    return this.http.post<OficinaList>(`${this.apiUrl}/oficina/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  getOficinaById(id: number): Observable<OficinaMsg> {
    return this.http.get<OficinaMsg>(`${this.apiUrl}/oficina/${id}`);
  }

  guardarOficina(oficina: OficinaForm){
    return this.http.post<MesaggeResponseNumber>(`${this.apiUrl}/oficina/add`, oficina);
  }

  editarOficina(oficina: Oficina, id:number){
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/oficina/editar/${id}`, oficina);
  }
}
