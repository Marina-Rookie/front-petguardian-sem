import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from '../../ngzorro.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../services/localstorage.service';
import { ModalService } from '../../services/shared/modals.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CuidadorService } from '../../services/cuidador.service';
import { ClienteService } from '../../services/cliente.service';
import { environment } from '../../../environments/environment.prod';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  isVisible = false;
  isMobile: boolean = false;
  formPerfilCliente: FormGroup = new FormGroup({});
  formPerfilCuidador: FormGroup = new FormGroup({});
  idUsuario: string = '';
  isCliente: boolean = false;
  isAdmin: boolean = false;
  isCuidadorPendiente: boolean = false;
  url: string = '';
  urlPerfil: string = '';
  loadingPerfil: boolean = false;
  urlApi: string = environment.url_server;
  mascotas: any = [];
  loadingMascotas: boolean = false;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private modalService: ModalService,
    private msg: NzMessageService,
    private cuidadorService: CuidadorService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private mascotaService: MascotaService
  ) {
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.route.paramMap.subscribe(params => {
      this.idUsuario = params.get('id') || '';
    });
    this.url = this.urlApi + 'usuarios/upload/' + this.idUsuario;
    this.isCliente = this.localStorageService.getIsCliente();
    this.isAdmin = this.localStorageService.getIsAdmin();
    this.isCuidadorPendiente = this.localStorageService.getIsCuidadorPendiente();
    this.initForm();
    this.buscarDatosPerfil();
    if (this.isCliente) {
      this.getMascotasPorUsuario();
    }
    this.modalService.recargarMascotas$.subscribe((recargar) => {
      if (recargar) {
        this.getMascotasPorUsuario();
      }
    });
  }

  uploadFotoPerfil(file: NzUploadChangeParam){
    if (file.type === 'success') {
      this.urlPerfil = file.file.response.usuario.imagenPerfil;
    }
  }

  buscarDatosPerfil() {
    this.loadingPerfil = true;
    if (this.isCliente) {
      this.clienteService.getById(this.idUsuario).subscribe({
        next: (data) => {
          this.setDatosformPerfilCliente(data);
          this.loadingPerfil = false;
        },
        error: () => {
          this.loadingPerfil = false;
        },
      });
    } else {
      this.cuidadorService.getById(this.idUsuario).subscribe({
        next: (data) => {
          this.setDatosformPerfilCuidador(data);
          this.loadingPerfil = false;
        },
        error: () => {
          this.loadingPerfil = false;
        },
      });
    }
  }

  setDatosformPerfilCliente(data: any) {
    this.formPerfilCliente.setValue({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono ?? '',
      email: data.email,
      domicilio: data.domicilio ?? '',
      nombreContactoEmergencia: data.nombreContactoEmergencia ?? '',
      contactoEmergencia: data.contactoEmergencia ?? '',
    });
    this.urlPerfil = data.imagenPerfil ? data.imagenPerfil : 'https://res.cloudinary.com/dddkkhrih/image/upload/v1729643117/fsn7sjzhcpzwo3qccpud.jpg';
  }

  setDatosformPerfilCuidador(data: any) {
    this.formPerfilCuidador.setValue({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono ?? '',
      email: data.email,
      domicilio: data.domicilio ?? '',
      descripcionPersonal: data.descripcionPersonal ?? '',
      tarifaHora: data.tarifaHora ?? '',
    });
    this.urlPerfil = data.imagenPerfil ? data.imagenPerfil : 'https://res.cloudinary.com/dddkkhrih/image/upload/v1729643117/fsn7sjzhcpzwo3qccpud.jpg';
  }

  initForm() {
    if (this.isCliente) {
      this.initFormPerfilCliente();
    } else {
      this.initFormPerfilCuidador();
    }
  }

  initFormPerfilCliente() {
    this.formPerfilCliente = this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      email: [''],
      domicilio: [''],
      nombreContactoEmergencia: [''],
      contactoEmergencia: [''],
    });
  }

  initFormPerfilCuidador() {
    this.formPerfilCuidador = this.fb.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      email: [''],
      domicilio: [''],
      descripcionPersonal: [''],
      tarifaHora: [''],
    });
  }

  actualizarDatosPerfil() {
    if (this.isCliente) {
      this.clienteService.put(this.formPerfilCliente.value, this.idUsuario).subscribe({
        next: () => {
          this.msg.success('Datos actualizados con éxito');
        },
        error: () => {
          this.msg.error('Error al actualizar los datos');
        },
      });
    } else {
      this.cuidadorService.put(this.formPerfilCuidador.value, this.idUsuario).subscribe({
        next: () => {
          this.msg.success('Datos actualizados con éxito');
        },
        error: () => {
          this.msg.error('Error al actualizar los datos');
        },
      });
    }
  }

  darDeBajaUsuario() {
    this.clienteService.eliminarUsuario(this.idUsuario).subscribe({
      next: () => {
        this.msg.success('Usuario dado de baja con éxito');
        this.localStorageService.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.msg.error('Error al dar de baja al usuario');
      },
    });
  }

  confirmDelete(): void {
    this.modal.confirm({
      nzTitle: '¿Está seguro que desea dar de baja su perfil?',
      nzContent: 'Esta acción no se puede deshacer',
      nzOnOk: () => this.darDeBajaUsuario(),
      nzOnCancel: () => console.log('Cancelado')
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  getMascotasPorUsuario() {
    this.loadingMascotas = true;
    this.mascotaService.getMascotasPorCliente(this.idUsuario).subscribe({
      next: (data) => {
        this.mascotas = data;
        this.loadingMascotas = false;
      },
      error: (error) => {
        this.loadingMascotas = false;
      },
    });
  }

  recargarMascotas() {
    this.getMascotasPorUsuario();
  }
}
