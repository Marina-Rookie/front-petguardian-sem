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
  precioReserva: number;
  turno: string;

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
    this.precioReserva = data.precioReserva;
    this.turno = data.turno;
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
    this.reservasFiltradas = data.reservasFiltradas || 0;
    this.totalReservas = data.totalReservas || 0;
    this.reservasPendientes = data.reservasPendientes || 0;
    this.reservasFinalizadas = data.reservasFinalizadas || 0;
    this.reservasAprobadas = data.reservasAprobadas || 0;
    this.reservasCanceladas = data.reservasCanceladas || 0;
    this.reservasNoAprobadas = data.reservasNoAprobadas || 0;
    this.reservasAnuladas = data.reservasAnuladas || 0;
    this.totalIngresos = data.totalIngresos || 0;
    this.promedioPuntuacion = data.promedioPuntuacion || 0;
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
