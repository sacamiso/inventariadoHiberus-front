import { Articulo} from 'src/app/core/model/articulo.model';
import { Oficina} from 'src/app/core/model/oficina.model';

export interface InventarioList {
    success:  boolean;
    error:    string;
    message:  Message[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface Message {
    codArticulo: number;
    idOficina:   number;
    stock:       number;
    articulo:    Articulo;
    oficina:     Oficina;
}