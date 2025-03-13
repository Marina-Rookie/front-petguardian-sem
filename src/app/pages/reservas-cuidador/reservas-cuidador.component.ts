import { Component } from '@angular/core';
import { NgZorroModule } from '../../ngzorro.module';
import { ReservaService } from '../../services/reserva.service';
import { MascotaService } from '../../services/mascota.service';
import { Reserva } from '../../models/Reserva';
import { LocalStorageService } from '../../services/localstorage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-cuidador',
  standalone: true,
  imports: [NgZorroModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reservas-cuidador.component.html',
})
export class ReservasCuidadorComponent {
  loading: boolean = false;
  reservas: Reserva[] = [];
  idCuidador: string = '';
  reservaSeleccionada: Reserva = {} as Reserva;
  expandSet = new Set<string>();
  turnos: { [key: string]: any[] } = {};
  tiposMascota: { [key: string]: string } = {};
  etapaVida: { [key: string]: string } = {};
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 0;

  constructor(
    private service: ReservaService,
    private mascotaService: MascotaService,
    private localstorage: LocalStorageService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.idCuidador = this.localstorage.getIdUsuario();
    this.getReservas();
  }

  getReservas() {
    this.loading = true;
    this.service.getReservasPorCuidador(this.idCuidador).subscribe((res) => {
      this.reservas = res;
      this.total = res.length;
      this.loading = false;
      this.reservas.forEach(reserva => {
        reserva.mascotas.forEach(mascota => {
          this.mascotaService.getTipoMascotaById(mascota._id).subscribe(tipoMascota => {
            this.tiposMascota[mascota._id] = tipoMascota.nombre;
          });
          this.mascotaService.getEtapaVidaById(mascota._id).subscribe({
            next: (etapaVida) => {
              this.etapaVida[mascota._id] = etapaVida.nombre;
              console.log(`Etapa de Vida for ${mascota._id}: ${etapaVida.nombre}`);
            },
            error: (error) => {
              console.error(`Error fetching Etapa de Vida for ${mascota._id}:`, error);
            }
          });
        });
      });
    });
  }

  aprobarReserva(idReserva: string) {
    this.service.aprobarReserva(idReserva).subscribe({
      next: (res) => {
        this.msg.success('Reserva aprobada');
        this.getReservas();
      },
      error: (err) => {
        this.msg.error('Error al aprobar la reserva');
      },
    });
  }

  rechazarReserva(idReserva: string) {
    this.service.rechazarReserva(idReserva).subscribe({
      next: (res) => {
        this.msg.success('Reserva rechazada');
        this.getReservas();
      },
      error: (err) => {
        this.msg.error('Error al rechazar la reserva');
      }
    });
  }

  anularReserva(idReserva: string) {
    this.service.anularReserva(idReserva).subscribe({
      next: (res) => {
        this.msg.success('Reserva anulada');
        this.getReservas();
      },
      error: (err) => {
        this.msg.error('Error al anular la reserva');
      }
    });
  }

  getStatusBadge(estado: string): string {
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
