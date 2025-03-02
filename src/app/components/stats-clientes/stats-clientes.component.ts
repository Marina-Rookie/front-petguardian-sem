import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { Estadisticas } from '../../models/ClienteInforme';

@Component({
  selector: 'app-stats-clientes',
  standalone: true,
  imports: [NzCardModule, NzStatisticModule, NzIconModule],
  templateUrl: './stats-clientes.component.html',
})
export class StatsClientesComponent {

  @Input() estadisticas: Estadisticas;
  
}
