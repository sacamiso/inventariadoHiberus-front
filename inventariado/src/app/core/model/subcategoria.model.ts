export interface SubcategoriaList {
    success: boolean;
    error:   string;
    message: Subcategoria[];
}

export interface Subcategoria {
    codigoSubcategoria: string;
    codigoCategoria:    string;
    nombre:             string;
}