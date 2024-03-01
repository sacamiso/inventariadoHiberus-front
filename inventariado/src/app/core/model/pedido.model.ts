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