import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from '../../ngzorro.module';
import { MascotaService } from '../../services/mascota.service';
import { ModalService } from '../../services/shared/modals.service';
import { LocalStorageService } from '../../services/localstorage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CardMascotaComponent } from '../../components/card-mascota/card-mascota.component';
import { NuevaMascotaComponent } from '../nueva-mascota/nueva-mascota.component';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
    CardMascotaComponent,
    NuevaMascotaComponent
  ],
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.scss']
})
export class MascotasComponent implements OnInit {
  isMobile: boolean = false;
  idUsuario: string = '';
  mascotas: any = [];
  loadingMascotas: boolean = false;
  isCliente: boolean = false;

  constructor(
    private mascotaService: MascotaService,
    private modalService: ModalService,
    private localStorageService: LocalStorageService,
    private msg: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.idUsuario = this.localStorageService.getIdUsuario();
    this.isCliente = this.localStorageService.getIsCliente();
    this.getMascotasPorUsuario();
    this.modalService.recargarMascotas$.subscribe((recargar) => {
      if (recargar) {
        this.getMascotasPorUsuario();
      }
    });
  }

  getMascotasPorUsuario() {
    this.loadingMascotas = true;
    this.mascotaService.getMascotasPorCliente(this.idUsuario).subscribe({
      next: (data) => {
        this.mascotas = data;
        this.loadingMascotas = false;
      },
      error: () => {
        this.loadingMascotas = false;
      },
    });
  }

  recargarMascotas() {
    this.getMascotasPorUsuario();
  }

  showModal(): void {
    this.modalService.setMascotaEditModal(null);
    this.modalService.showModal();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }
}
