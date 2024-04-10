export interface Proveedor {
    idProveedor:  number;
    cif:          string;
    razonSocial:  string;
    direccion:    string;
    codigoPostal: number | null;
    localidad:    string;
    telefono:     string;
    email:        string;
}

export interface ProveedorList {
    success:  boolean;
    error:    string;
    message:  Proveedor[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface ProveedorFiltros {
    cif:          string | null;
    razonSocial:  string | null;
    direccion:    string | null;
    codigoPostal: number | null;
    localidad:    string | null;
    telefono:     string | null;
    email:        string | null;
}