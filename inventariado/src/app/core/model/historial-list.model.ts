import { Articulo} from 'src/app/core/model/articulo.model';
import { Oficina} from 'src/app/core/model/oficina.model';

export interface HistorialList {
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
    fecha:       Date;
    stock:       number;
    articulo:    Articulo;
    oficina:     Oficina;
}