import { Articulo} from 'src/app/core/model/articulo.model';
import { Oficina} from 'src/app/core/model/oficina.model';
import { Pedido} from 'src/app/core/model/pedido.model';
import { Salida} from 'src/app/core/model/salida.model';
import { Estado} from 'src/app/core/model/estado.model';


export interface UnidadList {
    success:  boolean;
    error:    string;
    message:  Unidad[];
    limit:    number;
    skip:     number;
    numTotal: number;
}
export interface Unidad {
    codigoInterno: number;
    codEstado:     string;
    numeroPedido:  number;
    idSalida:      number;
    idOficina:     number;
    codArticulo:   number;
    estado:        Estado;
    pedido:        Pedido;
    salida:        Salida;
    oficina:       Oficina;
    articulo:      Articulo;
}

export interface UnidadEstado {
    codEstado:     string;
    idSalida:      number;
}

export interface UnidadFiltros {
    
    codEstado:     string;
    fechaPedido:   Date | null;
    fechaSalida:   Date | null;
    idOficina:     number;
    codArticulo:   number;
    
}

export interface UnidadForm {
    codigoInterno: number;
    codEstado:     string;
    numeroPedido:  number | null;
    idOficina:     number;
    codArticulo:   number;
}