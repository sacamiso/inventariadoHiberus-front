import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LineaList } from '../model/linea-list.model';

@Injectable({
  providedIn: 'root'
})
export class LineaService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getLineas(numPedido: number): Observable<LineaList> {
    return this.http.get<LineaList>(`${this.apiUrl}/linea/listPedido/${numPedido}`);
  }
}
