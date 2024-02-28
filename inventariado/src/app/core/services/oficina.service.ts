import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oficina } from '../model/oficina.model';

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

}
