import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';


@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.css']
})

//Guardo el paginador antiguo por si el nuevo da problemas


// export class PaginadorComponent implements OnInit, OnChanges {

//   @Input() numeroElementos: number = 0;
//   @Input() tamPag: number = 5;

//   @Output() pagina = new EventEmitter<number>();

  
//   pagActual: number = 0;
//   numPagTotales: number = 1; //puede que no haya ningún elemento

//   aux: Array<number> = [];

//   ngOnChanges(changes: SimpleChanges): void {
//       if(changes['tamPag'] && changes['tamPag'].currentValue){
//         this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
//         this.aux = new Array(this.numPagTotales);
//         this.pagActual = 0;
//         this.pagina.emit(this.pagActual);
//       }
//       if(changes['numeroElementos'] && changes['numeroElementos'].currentValue){
//         this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
//         this.aux = new Array(this.numPagTotales);
//       }
//   }
  
//   ngOnInit(): void {
//     this.numPagTotales = Math.ceil(this.numeroElementos/this.tamPag);
//     this.aux = new Array(this.numPagTotales);
//   }

//   cambiarPagina(pag: number) {
//     this.pagActual = pag;
//     this.pagina.emit(this.pagActual);
//   }

//   irAnterior(){
//     if(this.pagActual > 0){ //cuento que la numeración de las páginas va desde 0 hasta n-1
//       this.pagActual--;
//       this.pagina.emit(this.pagActual);
//     }
//   }

//   irSiguiente(){
//     if(this.pagActual < (this.numPagTotales-1)){
//       this.pagActual++;
//       this.pagina.emit(this.pagActual);
//     }
//   }

// }


export class PaginadorComponent implements OnInit, OnChanges {

  @Input() numeroElementos: number = 0;
  @Input() tamPag: number = 5;

  @Output() pagina = new EventEmitter<number>();

  pagActual: number = 0;
  numPagTotales: number = 1; // Puede que no haya ningún elemento

  aux: Array<number> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['tamPag'] && changes['tamPag'].currentValue) || (changes['numeroElementos'] && changes['numeroElementos'].currentValue)) {
      this.numPagTotales = Math.ceil(this.numeroElementos / this.tamPag);
      this.actualizarPaginas();

      this.pagActual = 0;
      this.pagina.emit(this.pagActual);
    }
  }

  ngOnInit(): void {
    this.numPagTotales = Math.ceil(this.numeroElementos / this.tamPag);
    this.actualizarPaginas();
  }

  actualizarPaginas() {
    this.aux = [];
    const paginasAMostrar = 5; // Siempre mostrar 5 paginas si hay 
    let inicio = Math.max(0, this.pagActual - 2); // Mostrar dos páginas antes de la actual
    let fin = Math.min(this.numPagTotales - 1, inicio + 4); // Mostrar dos páginas después de la actual
    
    // Añadir puntos suspensivos al principio si hay más páginas antes de la primera mostrada
    if (inicio > 0 && this.numPagTotales>5) {
      this.aux.push(-1);
    }

    // Ajustar el inicio si estamos en las últimas páginas
    if (fin - inicio < 4) {
      inicio = Math.max(0, fin - 4);
    }

    // Generar los índices de página a mostrar
    for (let i = inicio; i <= fin; i++) {
      this.aux.push(i);
    }

    // Añadir puntos suspensivos al final si hay más páginas después de la última mostrada
    if (fin < this.numPagTotales - 1 && this.numPagTotales>5) {
      this.aux.push(-1);
    }
  }

  cambiarPagina(pag: number) {
    this.pagActual = pag;
    this.pagina.emit(this.pagActual);
    this.actualizarPaginas();
  }

  irAnterior() {
    if (this.pagActual > 0) { // Cuento que la numeración de las páginas va desde 0 hasta n-1
      this.pagActual--;
      this.pagina.emit(this.pagActual);
      this.actualizarPaginas();
    }
  }

  irSiguiente() {
    if (this.pagActual < (this.numPagTotales - 1)) {
      this.pagActual++;
      this.pagina.emit(this.pagActual);
      this.actualizarPaginas();
    }
  }
}