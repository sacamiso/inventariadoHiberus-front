import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Condicion } from '../model/condicion.model';

@Injectable({
  providedIn: 'root'
})
export class CondicionService {

  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllCondiciones(): Observable<Array<Condicion>> {
    return this.http.get<Array<Condicion>>(`${this.apiUrl}/condicionPago/listAll`);
  }

}
