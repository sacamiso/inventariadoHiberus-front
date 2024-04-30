import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalidaList } from '../model/salida-list.model';
import { Salida, SalidaFiltros, SalidaForm } from '../model/salida.model';
import { MesaggeResponse, MesaggeResponseNumber } from '../model/mesagge-response.model';
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
    return this.http.post<MesaggeResponseNumber>(`${this.apiUrl}/salida/add`, salida);
  }

  getSalidaById(id: number): Observable<SalidaMsg> {
    return this.http.get<SalidaMsg>(`${this.apiUrl}/salida/${id}`);
  }

  getAllSalidas(): Observable<Array<Salida>> {
    return this.http.get<Array<Salida>>(`${this.apiUrl}/salida/listAll`);
  }

  descargarExcel(filtros: SalidaFiltros): Observable<ArrayBuffer> {
    return this.http.post(`${this.apiUrl}/salida/descargarExcel`, filtros, { responseType: 'arraybuffer' });
  }

  descargarExcelBySalida(id: number): Observable<ArrayBuffer> {
    return this.http.post(`${this.apiUrl}/salida/descargarExcelById?id=${id}`, null, { responseType: 'arraybuffer' });
  }
}
