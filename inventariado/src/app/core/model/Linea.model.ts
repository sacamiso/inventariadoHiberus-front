import { Articulo} from 'src/app/core/model/articulo.model';

export interface Linea {
    numeroPedido:   number;
    numeroLinea:    number;
    codigoArticulo: number;
    numeroUnidades: number;
    precioLinea:    number;
    descuento:      number;
    articulo:       Articulo;
}

export interface LineaForm {
    numeroLinea:    number;
    codigoArticulo: number;
    numeroUnidades: number;
    descuento:      number;
}