export class Cliente {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  reservasTotales: number;
  reservasCanceladas: number;
  reservasFinalizadas: number;
  reservasAprobadas: number;
  reservasPendientes: number;
  reservasNoAprobadas: number;

  constructor(data: any) {
    this._id = data._id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.email = data.email;
    this.telefono = data.telefono;
    this.reservasTotales = data.reservasTotales;
    this.reservasCanceladas = data.reservasCanceladas;
    this.reservasFinalizadas = data.reservasFinalizadas;
    this.reservasAprobadas = data.reservasAprobadas;
    this.reservasPendientes = data.reservasPendientes;
    this.reservasNoAprobadas = data.reservasNoAprobadas;
  }
}

export class Estadisticas {
  totalClientes: number;
  clientesFiltrados: number;
  clientes1a10: number;
  clientes11a20: number;
  clientes21a50: number;
  clientes51a100: number;

  constructor(data: any) {
    this.totalClientes = data.totalClientes;
    this.clientesFiltrados = data.clientesFiltrados;
    this.clientes1a10 = data.clientes1a10;
    this.clientes11a20 = data.clientes11a20;
    this.clientes21a50 = data.clientes21a50;
    this.clientes51a100 = data.clientes51a100;
  }
}

export class ClienteInforme {
  clientes: Cliente[];
  estadisticas: Estadisticas;

  constructor(data: any) {
    this.clientes = data.clientes.map((cliente: any) => new Cliente(cliente));
    this.estadisticas = new Estadisticas(data.estadisticas);
  }
}
