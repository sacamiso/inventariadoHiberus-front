import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';


@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})
export class PaginadorComponent implements OnInit, OnChanges {

  @Input() numeroElementos: number = 0;
  @Input() tamPag: number = 5;

  @Output() pagina = new EventEmitter<number>();

  
  pagActual: number = 0;
  numPagTotales: number = 1; //puede que no haya ningún elemento

  aux: Array<number> = [];

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['tamPag'] && changes['tamPag'].currentValue){
        this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
        this.aux = new Array(this.numPagTotales);
        this.pagActual = 0;
        this.pagina.emit(this.pagActual);
      }
      if(changes['numeroElementos'] && changes['numeroElementos'].currentValue){
        this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
        this.aux = new Array(this.numPagTotales);
      }
  }
  
  ngOnInit(): void {
    this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
    this.aux = new Array(this.numPagTotales);
  }

  cambiarPagina(pag: number) {
    this.pagActual = pag;
    this.pagina.emit(this.pagActual);
  }

  irAnterior(){
    if(this.pagActual > 0){ //cuento que la numeración de las páginas va desde 0 hasta n-1
      this.pagActual--;
      this.pagina.emit(this.pagActual);
    }
  }

  irSiguiente(){
    if(this.pagActual < (this.numPagTotales-1)){
      this.pagActual++;
      this.pagina.emit(this.pagActual);
    }
  }

}
