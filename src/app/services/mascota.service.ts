import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment.prod';
import { Mascota } from '../models/Mascota';
import { TipoMascota } from '../models/TipoMascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService extends ApiService<Mascota>{

  authURL = environment.url_server;

  constructor(http: HttpClient) {
    super(http, `${environment.url_server}` + 'mascotas');
  }

  getMascotasPorCliente(idCliente: string): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(`${this.authURL}mascotas/mascotasPorUsuario/${idCliente}`);
  }

  postImagenMascota(idMascota: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.authURL}mascotas/upload/${idMascota}`, formData);
  }

  getTipoMascotaById(idMascota: string): Observable<TipoMascota> {
    return this.http.get<TipoMascota>(`${this.authURL}tiposMascota/mascota/${idMascota}`);
  }

  getEtapaVidaById(idMascota: string): Observable<any> {
    return this.http.get<any>(`${this.authURL}etapasVida/mascota/${idMascota}`);
  }
}
