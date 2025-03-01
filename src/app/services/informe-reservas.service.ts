import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformeReservasService {

  private apiUrl = `${environment.url_server}informes/reservas`;

  constructor(private http: HttpClient) {}

  getReservas(filtros: { fechaInicio?: string; fechaFin?: string; nombre?: string; estado?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }
    if (filtros.nombre) {
      params = params.set('nombre', filtros.nombre);
    }
    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
}
