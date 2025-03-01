import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { StatsReservasComponent } from '../../components/stats-reservas/stats-reservas.component';
import { InformeReservasService } from '../../services/informe-reservas.service';
import { ReservaInforme, Estadisticas, Reserva } from '../../models/ReservaInforme';

@Component({
  selector: 'app-informe-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzSpinModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    StatsReservasComponent
  ],
  templateUrl: './informe-reservas.component.html',
  styleUrls: ['./informe-reservas.component.scss'],
})
export class InformeReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  estadisticas: Estadisticas = {
    reservasFiltradas: 0,
    totalReservas: 0,
    reservasPendientes: 0,
    reservasFinalizadas: 0,
    reservasAprobadas: 0,
    reservasCanceladas: 0,
    reservasNoAprobadas: 0,
    reservasAnuladas: 0,
    totalIngresos: 0,
    promedioPuntuacion: 0,
  };
  loading = false;
  fechaInicio: string = '';
  fechaFin: string = '';
  nombre: string = '';
  estado: string = '';

  constructor(
    private informeReservasService: InformeReservasService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getReservas();
  }

  getReservas() {
    this.loading = true;
    const filtros = {
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      nombre: this.nombre,
      estado: this.estado
    };
    this.informeReservasService.getReservas(filtros).subscribe({
      next: (data: ReservaInforme) => {
        console.log('Frontend Data:', data); // Log the data received
        this.reservas = data.reservas;
        this.estadisticas = data.estadisticas;
        this.loading = false;
      },
      error: (error) => {
        this.msg.error('Ha ocurrido un error al obtener las reservas');
        this.loading = false;
      },
    });
  }
}