import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Subcategoria, SubcategoriaList } from '../model/subcategoria.model';
import { ArticuloForm } from '../model/articulo.model';
import { MesaggeResponse } from '../model/mesagge-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  apiUrl = environment.API_URL;

  constructor(private readonly http: HttpClient) { }

  getAllSubcategorias(): Observable<Array<Subcategoria>> {
    return this.http.get<Array<Subcategoria>>(`${this.apiUrl}/subcategoria/listAll`);
  }

  getSubcategoriasByCategoria(cat: string): Observable<SubcategoriaList> {
    return this.http.get<SubcategoriaList>(`${this.apiUrl}/subcategoria/list/${cat}`);
  }

  
}
