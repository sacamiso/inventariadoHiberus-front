import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalidaList } from '../model/salida-list.model';

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getSalidasInterval(limit: number, skip: number): Observable<SalidaList> {
    return this.http.get<SalidaList>(`${this.apiUrl}/salida/listAllPag?limit=${limit}&skip=${skip}`);
  }
}
