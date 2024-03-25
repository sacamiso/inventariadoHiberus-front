import { Oficina } from "./oficina.model";
import { Subcategoria } from "./subcategoria.model";

export interface AvisoResponse {
    success: boolean;
    error:   string;
    message: Aviso[];
}

export interface Aviso {
    oficina:                Oficina;
    subcategoria:           Subcategoria;
    cantidadStockSeguridad: number;
    cantidadInventario:     number;
    cantidadNecesaria:      number;
}


export interface HayAvisoResponse {
    success: boolean;
    error:   string;
    message: boolean;
}