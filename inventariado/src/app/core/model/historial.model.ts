import { Articulo} from 'src/app/core/model/articulo.model';
import { Oficina} from 'src/app/core/model/oficina.model';

export interface Historial {
    codArticulo: number;
    idOficina:   number;
    fecha:       Date;
    stock:       number;
    articulo:    Articulo;
    oficina:     Oficina;
}