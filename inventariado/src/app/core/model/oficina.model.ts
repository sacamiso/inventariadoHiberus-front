export interface Oficina {
    idOficina:    number;
    codigoPostal: number | null;
    direccion:    string;
    localidad:    string;
    provincia:    string | null;
    pais:         string;
}

export interface OficinaMsg {
    success: boolean;
    error:   string;
    message: Oficina;
}

export interface OficinaList {
    success:  boolean;
    error:    string;
    message:  Oficina[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface OficinaFiltros {
    codigoPostal: number | null;
    direccion:    string | null;
    localidad:    string | null;
    provincia:    string | null;
    pais:         string | null;
}

export interface OficinaForm {
    codigoPostal: number | null;
    direccion:    string;
    localidad:    string;
    provincia:    string | null;
    pais:         string;
}