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

export interface HistorialInventarioFiltros {
    idOficina:     number;
    codArticulo:   number;
    stockMin: number | null;
    stockMax: number | null;
    fecha:   Date | null;
    fechaInicioIntervalo:   Date | null;
    fechaFinIntervalo:   Date | null;
}