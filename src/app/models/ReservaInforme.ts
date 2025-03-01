export class Reserva {
  _id: string;
  fechaInicio: string;
  fechaFin: string;
  comentario: string;
  cliente: string;
  cuidador: string;
  estado: string;
  puntuacion: number;
  resenia: { comentario: string };

  constructor(data: any) {
    this._id = data._id;
    this.fechaInicio = data.fechaInicio;
    this.fechaFin = data.fechaFin;
    this.comentario = data.comentario;
    this.cliente = data.cliente;
    this.cuidador = data.cuidador;
    this.estado = data.estado;
    this.puntuacion = data.puntuacion;
    this.resenia = data.resenia;
  }
}

export class Estadisticas {
  reservasFiltradas: number;
  totalReservas: number;
  reservasPendientes: number;
  reservasFinalizadas: number;
  reservasAprobadas: number;
  reservasCanceladas: number;
  reservasNoAprobadas: number;
  reservasAnuladas: number;
  totalIngresos: number;
  promedioPuntuacion: number;

  constructor(data: any) {
    this.reservasFiltradas = data.reservasFiltradas;
    this.totalReservas = data.totalReservas;
    this.reservasPendientes = data.reservasPendientes;
    this.reservasFinalizadas = data.reservasFinalizadas;
    this.reservasAprobadas = data.reservasAprobadas;
    this.reservasCanceladas = data.reservasCanceladas;
    this.reservasNoAprobadas = data.reservasNoAprobadas;
    this.reservasAnuladas = data.reservasAnuladas;
    this.totalIngresos = data.totalIngresos;
    this.promedioPuntuacion = data.promedioPuntuacion;
  }
}

export class ReservaInforme {
  reservas: Reserva[];
  estadisticas: Estadisticas;

  constructor(data: any) {
    this.reservas = data.reservas.map((reserva: any) => new Reserva(reserva));
    this.estadisticas = new Estadisticas(data.estadisticas);
  }
}
