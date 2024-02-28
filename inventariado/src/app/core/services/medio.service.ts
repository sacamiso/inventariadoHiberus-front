import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medio } from '../model/medio.model';

@Injectable({
  providedIn: 'root'
})
export class MedioService {

  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllMedios(): Observable<Array<Medio>> {
    return this.http.get<Array<Medio>>(`${this.apiUrl}/medioPago/listAll`);
  }
}
