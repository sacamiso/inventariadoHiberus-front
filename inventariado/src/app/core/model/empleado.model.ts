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