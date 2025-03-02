import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-stats-reservas',
  standalone: true,
  imports: [NzCardModule, NzStatisticModule, NzIconModule],
  templateUrl: './stats-reservas.component.html',
})
export class StatsReservasComponent {
  @Input() estadisticas: any;
}
