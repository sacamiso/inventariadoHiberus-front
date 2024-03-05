import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InventarioList } from '../model/inventario-list.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getInventarioInterval(limit: number, skip: number): Observable<InventarioList> {
    return this.http.get<InventarioList>(`${this.apiUrl}/inventario/listAllPag?limit=${limit}&skip=${skip}`);
  }

  getInventarioByOficina(idOficina: number): Observable<InventarioList> {
    return this.http.get<InventarioList>(`${this.apiUrl}/inventario/listOf/${idOficina}`);
  }

}
