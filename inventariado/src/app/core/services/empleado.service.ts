import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../model/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  apiUrl = environment.API_URL;

  constructor(
    private readonly http: HttpClient
  ) { }

  getAllEmpleados(): Observable<Array<Empleado>> {
    return this.http.get<Array<Empleado>>(`${this.apiUrl}/empleado/listAll`);
  }

}
