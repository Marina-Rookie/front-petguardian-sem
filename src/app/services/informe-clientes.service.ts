import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InformeClientesService extends ApiService<any> {

  authURL = environment.url_server;

  constructor(http: HttpClient) {
    super(http, `${environment.url_server}` + 'informe-clientes');
  }

  getInformesClientes(filtros: { nombre?: string; apellido?: string; email?: string; reservasMin?: number; reservasMax?: number }) {
    let params = new HttpParams();
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.apellido) {
      params = params.set('apellido', filtros.apellido);
    }
    if (filtros.email) {
      params = params.set('email', filtros.email);
    }
    if (filtros.reservasMin) {
      params = params.set('reservasMin', filtros.reservasMin.toString());
    }
    if (filtros.reservasMax) {
      params = params.set('reservasMax', filtros.reservasMax.toString());
    }

    return this.http.get(`${this.authURL}informes/clientes-con-reservas`, { params });
  }
}
