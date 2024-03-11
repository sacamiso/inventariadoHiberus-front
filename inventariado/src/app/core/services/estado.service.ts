import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estado } from '../model/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getEstados(): Observable<Array<Estado>> {
    return this.http.get<Array<Estado>>(`${this.apiUrl}/estado/listAll`);
  }
}
