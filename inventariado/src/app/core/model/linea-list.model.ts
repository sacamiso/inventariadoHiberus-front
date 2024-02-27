import { Articulo} from 'src/app/core/model/articulo.model';

export interface LineaList {
    success: boolean;
    error:   string;
    message: Message[];
}

export interface Message {
    numeroPedido:   number;
    numeroLinea:    number;
    codigoArticulo: number;
    numeroUnidades: number;
    precioLinea:    number;
    descuento:      number;
    articulo:       Articulo;
}