import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proveedor } from '../model/proveedor.model';

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
}
