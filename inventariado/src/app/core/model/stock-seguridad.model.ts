import { Oficina} from 'src/app/core/model/oficina.model';

export interface StockSeguridad {
    codSubcategoria:   string;
    codCategoria:      string;
    idOficina:         number;
    cantidad:          number;
    plazoEntregaMedio: number;
    oficina:           Oficina;
}

export interface StockSeguridadForm {
    codSubcategoria:   string;
    codCategoria:      string;
    idOficina:         number;
    cantidad:          number;
    plazoEntregaMedio: number;
}