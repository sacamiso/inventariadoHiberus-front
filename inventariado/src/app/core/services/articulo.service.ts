import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Articulo, ArticuloFiltros, ArticuloForm, ArticuloList, ArticuloMsg } from '../model/articulo.model';
import { MesaggeResponse, MesaggeResponseNumber } from '../model/mesagge-response.model';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllArticulos(): Observable<Array<Articulo>> {
    return this.http.get<Array<Articulo>>(`${this.apiUrl}/articulo/listAll`);
  }

  getArticulosInterval(limit: number, skip: number, filtros: ArticuloFiltros): Observable<ArticuloList> {
    return this.http.post<ArticuloList>(`${this.apiUrl}/articulo/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  guardarArticulo(articulo: ArticuloForm){
    return this.http.post<MesaggeResponseNumber>(`${this.apiUrl}/articulo/add`, articulo);
  }

  getArticuloById(id: number): Observable<ArticuloMsg> {
    return this.http.get<ArticuloMsg>(`${this.apiUrl}/articulo/${id}`);
  }

  editarArticulo(articulo: Articulo, id:number){
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/articulo/editar/${id}`, articulo);
  }
}
