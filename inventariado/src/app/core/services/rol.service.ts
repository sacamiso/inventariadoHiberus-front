import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../model/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getAllRoles(): Observable<Array<Rol>> {
    return this.http.get<Array<Rol>>(`${this.apiUrl}/rol/listAll`);
  }
}
