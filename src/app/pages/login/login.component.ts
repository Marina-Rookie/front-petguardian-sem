import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localstorage.service';
import { LoginService } from '../../services/login.service';
import { NgZorroModule } from '../../ngzorro.module';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgZorroModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin: boolean = true;
  registerForm: FormGroup = new FormGroup({});
  loginForm: FormGroup = new FormGroup({});
  checked: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private localStorage: LocalStorageService,
    private router: Router,
    private msg: NzMessageService,
    private notification: NzNotificationService
  ) {
    this.localStorage.crearValues();
  }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmarPassword: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      domicilio: ['', [Validators.required]],
      cuidador: [false, [Validators.required]],
      cliente: [false]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmarPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmitRegister(): void {
    this.loading = true;
    if (this.registerForm.valid) {
      this.service.post(this.registerForm.value).subscribe({
        next: (data: any) => {
          this.loading = false;
          this.setItemsAndNavigate(data);
        },
        error: (error: any) => {
          this.loading = false;
          this.msg.error('Error al registrar usuario');
        },
      });
    } else if (this.registerForm.errors?.['mismatch']) {
      this.loading = false;
      this.notification.error('Error', 'Las contraseñas no coinciden');
    }
  }

  onSubmitLogin(): void {
    this.loading = true;
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.loading = false;
          this.setItemsAndNavigate(data);
        },
        error: (error: any) => {
          this.loading = false;
          this.msg.error('Usuario o contraseña incorrectos');
        },
      });
    }
  }

  setItemsAndNavigate(data: any): void {
    this.localStorage.setItem('token', data['token']);
    this.localStorage.setItem('idUsuario', data['idUsuario']);
    this.localStorage.setItem('rol', data['rol']);

    const isCliente = this.localStorage.getIsCliente();
    const isCuidadorHabilitado = this.localStorage.getIsCuidadorHabilitado();
    const rol = data['rol'];

    if (isCliente) {
      this.router.navigate(['/cuidadores']);
    } else if (isCuidadorHabilitado) {
      this.router.navigate(['/reservas-cuidador']);
    } else if (rol === 'Cuidador No Habilitado') {
      this.router.navigate(['/perfil/' + data['idUsuario']]);
    } else {
      this.router.navigate(['/perfil/' + data['idUsuario']]);
    }
  }

  onStatusChange(field: string) {
    const form = this.formLogin ? this.loginForm : this.registerForm;
    const control = form.get(field);
    if (control) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }

    if (field === 'confirmarPassword') {
      const passwordControl = this.registerForm.get('password');
      if (passwordControl && control.value !== passwordControl.value) {
        this.msg.warning('Las contraseñas no coinciden');
      }
    }
  }

}
