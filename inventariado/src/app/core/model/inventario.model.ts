import { Articulo} from 'src/app/core/model/articulo.model';
import { Oficina} from 'src/app/core/model/oficina.model';
export interface Inventario {
    codArticulo: number;
    idOficina:   number;
    stock:       number;
    articulo:    Articulo;
    oficina:     Oficina;
}

export interface InventarioFiltros {
    idOficina:     number;
    codArticulo:   number;
    stockMin: number | null;
    stockMax: number | null;
}