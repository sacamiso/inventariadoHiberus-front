import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PedidoList } from '../model/pedido-list.model';
import { PedidoMsg } from '../model/pedido-msg.model';
import { MesaggeResponse } from '../model/mesagge-response.model';
import { Pedido, PedidoFiltros, PedidoForm } from '../model/pedido.model';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getPedidosInterval(limit: number, skip: number, filtros: PedidoFiltros): Observable<PedidoList> {
    return this.http.post<PedidoList>(`${this.apiUrl}/pedido/listAllPag?limit=${limit}&skip=${skip}`, filtros);
  }

  getPedidoById(id: number): Observable<PedidoMsg> {
    return this.http.get<PedidoMsg>(`${this.apiUrl}/pedido/${id}`);
  }

  marcarRecibido(idP: number): Observable<MesaggeResponse> {
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/pedido/recibido?idP=${idP}`, null);
  }

  guardarPedido(pedido: PedidoForm){
    return this.http.post<MesaggeResponse>(`${this.apiUrl}/pedido/add`, pedido);
  }

  getAllPedidos(): Observable<Array<Pedido>> {
    return this.http.get<Array<Pedido>>(`${this.apiUrl}/pedido/listAll`);
  }

  devolverPedido(idP: number): Observable<MesaggeResponse> {
    return this.http.put<MesaggeResponse>(`${this.apiUrl}/pedido/devolver?idP=${idP}`, null);
  }
}
