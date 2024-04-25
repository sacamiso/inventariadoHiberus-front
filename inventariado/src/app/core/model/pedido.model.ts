import { Oficina} from 'src/app/core/model/oficina.model';
import { Condicion} from 'src/app/core/model/condicion.model';
import { Empleado} from 'src/app/core/model/empleado.model';
import { Medio} from 'src/app/core/model/medio.model';
import { Proveedor} from 'src/app/core/model/proveedor.model';
import { LineaForm } from './Linea.model';


export interface Pedido {
    numeroPedido:   number;
    fechaPedido:    Date;
    ivaPedido:      number;
    costeTotal:     number;
    idEmpleado:     number;
    plazoEntrega:   number;
    costesEnvio:    number;
    idProveedor:    number;
    idOficina:      number;
    fechaRecepcion: Date;
    condicionPago:  string;
    medioPago:      string;
    devuelto:       boolean;
    costeUnitario:  number;
    numeroUnidades: number;
    empleado:       Empleado;
    proveedor:      Proveedor;
    oficina:        Oficina;
    condicion:      Condicion;
    medio:          Medio;
}

export interface PedidoForm {
    ivaPedido:      number;
    idEmpleado:     number;
    plazoEntrega:   number;
    costesEnvio:    number;
    idProveedor:    number;
    idOficina:      number;
    condicionPago:  string;
    medioPago:      string;
    lineas: Array<LineaForm>;
}

export interface PedidoFiltros {
    fechaPedido:    Date | null;
    ivaPedidoMin:      number | null;
    ivaPedidoMax:      number | null;
    costeTotalMin:     number | null;
    costeTotalMax:     number | null;
    idEmpleado:     number | null;
    plazoEntregaMin:   number | null;
    plazoEntregaMax:   number | null;
    costesEnvioMin:    number | null;
    costesEnvioMax:    number | null;
    idProveedor:    number | null;
    idOficina:      number | null;
    fechaRecepcion: Date | null;
    codigoCondicionPago:  string | null;
    codigoMedioPago:      string | null;
    recibido: boolean | null;
    costeUnitarioMin:  number | null;
    costeUnitarioMax: number | null;
    devuelto:       boolean | null;
    fechaInicioIntervalo:   Date | null;
    fechaFinIntervalo:   Date | null;
}