import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proveedor, ProveedorFiltros, ProveedorList } from '../model/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  
  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllProveedores(): Observable<Array<Proveedor>> {
    return this.http.get<Array<Proveedor>>(`${this.apiUrl}/proveedor/listAll`);
  }

  getProveedoresInterval(limit: number, skip: number, filtros: ProveedorFiltros): Observable<ProveedorList> {
    return this.http.post<ProveedorList>(`${this.apiUrl}/proveedor/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }
}
