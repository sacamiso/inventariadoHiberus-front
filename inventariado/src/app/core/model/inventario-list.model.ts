export interface InventarioList {
    success:  boolean;
    error:    string;
    message:  Message[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface Message {
    codArticulo: number;
    idOficina:   number;
    stock:       number;
}