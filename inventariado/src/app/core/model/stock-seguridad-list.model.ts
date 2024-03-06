import { Oficina} from 'src/app/core/model/oficina.model';

export interface StockSeguridadList {
    success:  boolean;
    error:    string;
    message:  Message[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface Message {
    codSubcategoria:   string;
    codCategoria:      string;
    idOficina:         number;
    cantidad:          number;
    plazoEntregaMedio: number;
    oficina:           Oficina;
}