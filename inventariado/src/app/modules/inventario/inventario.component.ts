import { Component, OnInit} from '@angular/core';
import { Inventario } from 'src/app/core/model/inventario.model';
import { Router } from '@angular/router';
import { InventarioService } from '../../core/services/inventario.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  inventarios:Array<Inventario> = [];
  numeroInventarios: number = 0;
  pagina: number = 0;
  tamPag: number = 5;
  cargado = false;

  constructor(private readonly inventarioService: InventarioService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(pag: number) {
    this.pagina = pag;
    this.listaElementosMostrar(this.tamPag, this.pagina);
  }

  listaElementosMostrar(limit: number, skip: number) {
    this.inventarioService.getInventarioInterval(limit, skip).subscribe({
      next: (response) => {
        this.inventarios = response.message;
        this.numeroInventarios = response.numTotal;
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

  verHistorial() {
    this.router.navigate(['historial']);
  }
}
