import { Component, OnInit } from '@angular/core';
import { Salida } from 'src/app/core/model/salida.model';
import { Router } from '@angular/router';
import { SalidaService } from '../../core/services/salida.service';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.css']
})
export class SalidasComponent implements OnInit {

  salidas: Array<Salida> = [];
  numeroSalidas: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  constructor(
    private readonly salidaService: SalidaService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.salidaService.getSalidasInterval(limit, skip).subscribe({
      next: (response) => {
        this.salidas = response.message;
        this.numeroSalidas = response.numTotal;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.cargado = true;
      }
    })
  }

  Multiplos5(total: number) {
    return Array.from({ length: total }, (_, i) => (i + 1) * 5); 
  }

  crearNuevaSalida(){
    this.router.navigate([`salidas/nueva`]);
  }

  detalleSalida(id: number){
    this.router.navigate([`salidas/salida/${id}`]);
  }
}
