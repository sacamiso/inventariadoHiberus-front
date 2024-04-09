import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Proveedor } from 'src/app/core/model/proveedor.model';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores: Array<Proveedor> = [];
  numeroProveedores: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  mostrarFiltros = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
