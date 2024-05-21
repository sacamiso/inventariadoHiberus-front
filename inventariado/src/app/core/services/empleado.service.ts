import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado, EmpleadoCambioContrasena, EmpleadoFiltros, EmpleadoForm, EmpleadoList, EmpleadoMsg } from '../model/empleado.model';
import { MesaggeResponse, MesaggeResponseNumber } from '../model/mesagge-response.model';

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

  getEmpleadosInterval(limit: number, skip: number, filtros: EmpleadoFiltros): Observable<EmpleadoList> {
    return this.http.post<EmpleadoList>(`${this.apiUrl}/empleado/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  guardarEmpleado(empleado: EmpleadoForm){
    return this.http.post<MesaggeResponseNumber>(`${this.apiUrl}/empleado/add`, empleado);
  }

  getEmpleadoById(id: number): Observable<EmpleadoMsg> {
    return this.http.get<EmpleadoMsg>(`${this.apiUrl}/empleado/${id}`);
  }

  getEmpleadosByOficina(id: number): Observable<EmpleadoList> {
    return this.http.get<EmpleadoList>(`${this.apiUrl}/empleado/listAll/oficina/${id}`);
  }

  cambiarContrasena(empleado: EmpleadoCambioContrasena): Observable<MesaggeResponse> {
    return this.http.post<MesaggeResponse>(`${this.apiUrl}/empleado/cambiarContra`, empleado);
  }
  
  editarEmpleado(empleado: Empleado, id:number){
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/empleado/editar/${id}`, empleado);
  }
}
