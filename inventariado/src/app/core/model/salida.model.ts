import { Oficina} from 'src/app/core/model/oficina.model';
import { Articulo} from 'src/app/core/model/articulo.model';

export interface Salida {
    idSalida:      number;
    numUnidades:   number;
    costeTotal:    number;
    costeUnitario: number;
    fechaSalida:   Date;
    idOficina:     number;
    codArticulo:   number;
    oficina:       Oficina;
    articulo:      Articulo;
}