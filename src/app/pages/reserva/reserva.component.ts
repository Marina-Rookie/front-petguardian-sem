import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/localstorage.service';
import { Reserva } from '../../models/Reserva';
import { ReservaService } from '../../services/reserva.service';
import { NgZorroModule } from '../../ngzorro.module';
import { ReseniaService } from '../../services/resenia.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Resenia } from '../../models/Resenia';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent implements OnInit {
  isVisible = false;
  puntuacion = 0;
  comentario = '';
  idCliente: string = '';
  reservas: Reserva[] = [];
  reservaSeleccionada: Reserva = {} as Reserva;
  loading: boolean = false;
  isMobile: boolean = window.innerWidth <= 768;
  expandSet = new Set<string>();
  turnos: { [key: string]: any[] } = {};
  totalReservas = 0;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private service: ReservaService,
    private reseniaService: ReseniaService,
    private localStorageService: LocalStorageService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.idCliente = this.localStorageService.getIdUsuario();
    this.getReservas();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  getReservas(): void {
    this.loading = true;
    this.service.getReservasPorCliente(this.idCliente).subscribe({
      next: (data: Reserva[]) => {
        this.totalReservas = data.length;
        this.reservas = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
      }
    });
  }

  getStatus(estado: string): string {
    switch (estado) {
      case 'Cancelada':
      case 'No aprobada':
        return 'error';
      case 'Pendiente':
        return 'processing';
      case 'Finalizada':
      case 'Aprobada':
        return 'success';
      default:
        return 'default';
    }
  }

  openModal(reserva: Reserva): void {
    this.isVisible = true;
    if (reserva.resenia) {
      this.comentario = reserva.resenia.comentario;
      this.puntuacion = reserva.resenia.puntuacion;
    }
    this.reservaSeleccionada = reserva;
  }

  handleOk(): void {
    this.isVisible = false;
    if (!this.reservaSeleccionada.resenia) {
      const resenia = new Resenia(this.reservaSeleccionada!._id, this.puntuacion, this.comentario);

      this.reseniaService.post(resenia).subscribe({
        next: () => {
          this.getReservas();
          this.puntuacion = 0;
          this.comentario = '';
          this.msg.success('Reseña enviada correctamente');
        },
        error: (error: any) => {
          console.error(error);
          this.msg.error('Ha ocurrido un error al enviar la reseña');
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  cancelarReserva(reserva: Reserva): void {
    this.service.cancelarReserva(reserva._id).subscribe({
      next: () => this.getReservas(),
      error: (error: any) => console.error(error)
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      this.service.getTurnosPorReserva(id).subscribe({
        next: (data: any[]) => {
          this.turnos[id] = data;
        },
        error: (error: any) => {
          console.error(error);
        }

      });
              console.log('Turnos:', this.turnos);
    } else {
      this.expandSet.delete(id);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getReservas();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getReservas();
  }
}
