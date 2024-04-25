import { Oficina } from 'src/app/core/model/oficina.model';
import { Articulo } from 'src/app/core/model/articulo.model';

export interface Salida {
    idSalida: number;
    numUnidades: number;
    costeTotal: number;
    costeUnitario: number;
    fechaSalida: Date;
    idOficina: number;
    codArticulo: number;
    oficina: Oficina;
    articulo: Articulo;
}

export interface SalidaForm {
    numUnidades: number;
    costeTotal: number;
    costeUnitario: number;
    fechaSalida: Date;
    idOficina: number;
    codArticulo: number;
}

export interface SalidaFiltros {
    numeroUnidades: number | null;
    costeTotalMin: number | null;
    costeTotalMax: number | null;
    costeUnitarioMin: number | null;
    costeUnitarioMax: number | null;
    fechaSalida: Date | null;
    idOficina: number | null;
    codArticulo: number | null;
    fechaInicioIntervalo:   Date | null;
    fechaFinIntervalo:   Date | null;
}