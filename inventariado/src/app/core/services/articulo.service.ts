import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Articulo, ArticuloFiltros, ArticuloList } from '../model/articulo.model';

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
}
