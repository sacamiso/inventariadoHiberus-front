import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoList } from '../model/pedido-list.model';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getPedidosInterval(limit: number, skip: number): Observable<PedidoList> {
    return this.http.get<PedidoList>(`${this.apiUrl}/pedido/listAllPag?limit=${limit}&skip=${skip}`);
  }
}
