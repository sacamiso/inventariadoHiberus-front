import { Empleado } from "./empleado.model";
import { Unidad } from "./unidad.model";

export interface Asignacion {
    idAsignacion: number;
    fechaInicio:  Date;
    fechaFin:     Date;
    idEmpleado:   number;
    codUnidad:    number;
    empleado:     Empleado;
    unidad:       Unidad;
}

export interface AsignacionFiltros {
    fechaInicio:  Date | null;
    fechaFin:     Date | null;
    dniEmpleado:  string | null;
    nombreEmpleado:     string | null;
    apellidosEmpleado:  string | null;
    codOficinaEmpleado: number | null;
    codUnidad:    number | null;
    finalizadas: boolean | null;
}

export interface AsignacionList {
    success:  boolean;
    error:    string;
    message:  Asignacion[];
    limit:    number;
    skip:     number;
    numTotal: number;
}

export interface AsignacionMsg {
    success: boolean;
    error:   string;
    message: Asignacion;
}

export interface AsignacionForm {
    fechaInicio:  Date;
    idEmpleado:   number;
    codUnidad:    number;
}

export interface AsignacionEdit {
    fechaInicio:  Date;
    fechaFin:  Date | null;
}