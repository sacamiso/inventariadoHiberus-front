export interface Articulo {
    codigoArticulo: number;
    descripcion: string;
    precioUnitario: number;
    referencia: string;
    codCategoria: string;
    codSubcategoria: string;
    iva: number;
    fabricante: string;
    modelo: string;
}

export interface ArticuloFiltros {
    descripcion: string | null;
    precioUnitarioMin: number | null;
    precioUnitarioMax: number | null;
    referencia: number | null;
    codigoCategoria: string | null;
    codigoSubcatogria: string | null;
    ivaMin: number | null;
    ivaMax: number | null;
    fabricante: string | null;
    modelo: string | null;
}

export interface ArticuloList {
    success:  boolean;
    error:    string;
    message:  Articulo[];
    limit:    number;
    skip:     number;
    numTotal: number;
}
