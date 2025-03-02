import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { StatsClientesComponent } from '../../components/stats-clientes/stats-clientes.component';
import {
  Cliente,
  ClienteInforme,
  Estadisticas,
} from '../../models/ClienteInforme';
import { InformeClientesService } from '../../services/informe-clientes.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgZorroModule } from '../../ngzorro.module';

@Component({
  selector: 'app-informes-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgZorroModule,
    StatsClientesComponent
  ],
  templateUrl: './informe-clientes.component.html',
  styleUrl: './informe-clientes.component.scss',
})
export class InformesClientesComponent {
  informe: ClienteInforme;
  estadisticas: Estadisticas = {
    totalClientes: 0,
    clientesFiltrados: 0,
    clientes1a10: 0,
    clientes11a20: 0,
    clientes21a50: 0,
    clientes51a100: 0,
  };

  expandSet = new Set<string>();
  loading = false;

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  searchValue = '';
  selectedStatus = '0';
  listClientes: Cliente[] = [];

  constructor(
    private informeClientesService: InformeClientesService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getInformes();
  }

  getInformes() {
    this.loading = true;

    const filtros = {
      nombre: this.searchValue,
      reservasMin: this.selectedStatus === 'Todos' ? undefined : this.selectedStatus === '0' ? 0 : this.selectedStatus === '1-10' ? 1 : this.selectedStatus === '11-20' ? 11 : this.selectedStatus === '21-50' ? 21 : 51,
      reservasMax: this.selectedStatus === 'Todos' ? undefined : this.selectedStatus === '0' ? 0 : this.selectedStatus === '1-10' ? 10 : this.selectedStatus === '11-20' ? 20 : this.selectedStatus === '21-50' ? 50 : 100,
    };
    console.log('Filtros:', filtros);
    this.informeClientesService.getInformesClientes(filtros).subscribe({
      next: (data: ClienteInforme) => {
        this.informe = data;
        console.log(data);
        this.listClientes = data.clientes;
        this.estadisticas = data.estadisticas;
        this.loading = false;
      },
      error: (error) => {
        this.msg.error('Ha ocurrido un error al obtener los informes');
        this.loading = false;
      },
    });
  }
}
