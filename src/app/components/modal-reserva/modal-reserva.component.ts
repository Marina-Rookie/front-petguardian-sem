import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgZorroModule } from '../../ngzorro.module';
import { LocalStorageService } from '../../services/localstorage.service';
import { MascotaService } from '../../services/mascota.service';
import { ReservaService } from '../../services/reserva.service';
import { ModalService } from '../../services/shared/modals.service';
import { TurnosService } from '../../services/turnos.service';
import { CuidadorService  } from '../../services/cuidador.service';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [NgZorroModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-reserva.component.html',
})
export class ModalReservaComponent {
  cuidador: any = {};
  formReserva: FormGroup = new FormGroup({});
  isVisible = false;
  turnosDisponibles = [];
  mascotas: any = [];
  idUsuario: string = '';
  noDisponibilidad: boolean = false;
  availabilityChecked: boolean = false;
  diasReserva: any[] = [];
  editByDay: boolean = false;
  tarifaTurno: number = 0;
  precioFinal: number = 0;

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private msg: NzMessageService,
    private turnoService: TurnosService,
    private mascotaService: MascotaService,
    private reservaService: ReservaService,
    private cuidadorService: CuidadorService,

  ) {}

  ngOnInit() {
    this.idUsuario = this.localStorageService.getIdUsuario();
    this.modalService.isVisibleModalReserva$.subscribe((isVisible) => {
      this.isVisible = isVisible;
      if (!isVisible) {
        this.resetAvailabilityCheck();
      }
    });
    this.modalService.cuidadorReservaModal$.subscribe((cuidador) => {
      if(cuidador === null) return;
      this.cuidador = cuidador;
      this.formInit();
      this.getMascotasUsuario();
      this.getTarifaTurnoCuidador();
    });
  }

  resetAvailabilityCheck() {
    this.noDisponibilidad = false;
    this.availabilityChecked = false;
    this.diasReserva = [];
    this.editByDay = false;
    this.precioFinal = 0;
  }

  formInit() {
    this.formReserva = this.fb.group({
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
      horaTurno: [null, [Validators.required]],
      diasReserva: this.fb.array([]),
      mascotas: [null, [Validators.required]],
      clienteId: [this.idUsuario],
      cuidador: [this.cuidador._id],
      comentario: [null],
    });
  }

  get diasReservaArray(): FormArray {
    return this.formReserva.get('diasReserva') as FormArray;
  }

  getTurnosDisponibles() {
    const fechaInicio = this.formReserva.get('fechaInicio')?.value;
    const fechaFin = this.formReserva.get('fechaFin')?.value;
    
    if (fechaInicio && fechaFin) {
      const body = {
        cuidadorId: this.cuidador._id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
      };
      this.turnoService.postTurnosDisponiblidad(body).subscribe((res: any) => {
        this.turnosDisponibles = res;
        this.noDisponibilidad = !(this.turnosDisponibles.length > 0);
        this.availabilityChecked = true;
        this.setDiasReserva(fechaInicio, fechaFin);
        this.calculatePrecioFinal();
      });
    } else {
      this.availabilityChecked = false;
    }
  }

  setDiasReserva(fechaInicio: string, fechaFin: string) {
    const interval = eachDayOfInterval({
      start: parseISO(fechaInicio + 'T00:00:00'),
      end: parseISO(fechaFin + 'T00:00:00'),
    });

    this.diasReservaArray.clear();
    interval.forEach((date) => {
      this.diasReservaArray.push(
        this.fb.group({
          fecha: [format(date, 'yyyy-MM-dd'), [Validators.required]],
          horaTurno: [this.formReserva.get('horaTurno')?.value, [Validators.required]],
        })
      );
    });
  }

  getMascotasUsuario() {
    this.mascotaService.getMascotasPorCliente(this.idUsuario).subscribe((res: any) => {
      this.mascotas = res;
    });
  }

  getTarifaTurnoCuidador() {
    this.cuidadorService.getCuidadorByUserId(this.cuidador._id).subscribe((res: any) => {
      this.tarifaTurno = res.tarifaHora;
    });
  }

  calculatePrecioFinal() {
    const fechaInicio = parseISO(this.formReserva.get('fechaInicio')?.value + 'T00:00:00');
    const fechaFin = parseISO(this.formReserva.get('fechaFin')?.value + 'T00:00:00');
    const days = eachDayOfInterval({ start: fechaInicio, end: fechaFin }).length;
    this.precioFinal = days * this.tarifaTurno;
  }

  postFormReserva() {
    const reservaData = {
      ...this.formReserva.value,
      diasReserva: this.diasReservaArray.value.map((dia: any) => ({
        fecha: dia.fecha,
        horaTurno: dia.horaTurno,
      }))
    };
    delete reservaData.horaTurno;
    this.reservaService.post(reservaData).subscribe({
      next: (res: any) => {
        this.msg.create('success', 'Reserva realizada con éxito');
      },
      error: (error) => {
        this.msg.create('error', error.error.message);
      },
    });
  }

  handleOk(): void {
    this.postFormReserva();
    this.modalService.hideReservaModal();
  }

  handleCancel(): void {
    this.modalService.hideReservaModal();
  }

  toggleEditByDay(): void {
    this.editByDay = !this.editByDay;
    if (this.editByDay) {
      this.setDiasReserva(this.formReserva.get('fechaInicio')?.value, this.formReserva.get('fechaFin')?.value);
    }
  }

  trackTurno(index: number, turno: any): any {
    return turno;
  }

  trackMascota(index: number, mascota: any): any {
    return mascota._id;
  }
}
