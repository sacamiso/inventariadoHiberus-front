import { Oficina} from 'src/app/core/model/oficina.model';
import { Rol} from 'src/app/core/model/rol.model';

export interface Empleado {
    idEmpleado: number;
    dni:        string;
    nombre:     string;
    apellidos:  string;
    usuario:    string;
    contraseña: string;
    codRol:     string;
    idOficina:  number;
    rol:        Rol;
    oficina:    Oficina;
}

export interface EmpleadoFiltros {
    dni:        string | null;
    nombre:     string | null;
    apellidos:  string | null;
    usuario:    string | null;
    codRol:     string | null;
    idOficina:  number | null;
}

export interface EmpleadoList {
    success:  boolean;
    error:    string;
    message:  Empleado[];
    limit:    number;
    skip:     number;
    numTotal: number;
}