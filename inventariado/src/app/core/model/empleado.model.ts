import { Oficina} from 'src/app/core/model/oficina.model';
import { Rol} from 'src/app/core/model/rol.model';

export interface Empleado {
    idEmpleado: number;
    dni:        string;
    nombre:     string;
    apellidos:  string;
    usuario:    string;
    correo:     string;
    contraseña: string;
    codRol:     string;
    idOficina:  number;
    rol:        Rol;
    oficina:    Oficina;
}

export interface EmpleadoCambioContrasena {
    empleado: Empleado;
    contraAct: string;
    contraNueva: string;
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

export interface EmpleadoForm {
    dni:        string;
    nombre:     string;
    apellidos:  string;
    correo:     string;
    usuario:    string;
    contraseña: string;
    codRol:     string;
    idOficina:  number;
}


export interface EmpleadoMsg {
    success: boolean;
    error:   string;
    message: Empleado;
}

export interface AuthRequest {
    dni: string;
    username: string;
    pass: string;
}

export interface AuthResponse {
    jwt: string;
}