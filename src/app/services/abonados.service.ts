import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// ENVIRONMENT
import { environment } from '../../environments/environment';

// MODELS
import { Abonado } from '../models/abonado.model';

// INTERFACES
import { LoadAbonados } from '../interfaces/load-abonados.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AbonadosService {

  constructor(  private http: HttpClient) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *  LOAD USERS
  ==================================================================== */
  loadAbonados(){

    return this.http.get<LoadAbonados>( `${base_url}/abonados`, this.headers );

  }

  /** ================================================================
   *  LOAD ABONADO BY ID /abonado/:id'
  ==================================================================== */
  loadAbonadoId(id: string){
    return this.http.get<{ok: boolean, abonado: Abonado}>(`${base_url}/abonados/abonado/${id}`, this.headers);
  }

  /** ================================================================
   *  CREATE ABONADO
  ==================================================================== */
  createAbonado( formaData: any ){
    return this.http.post<{abonado: Abonado, ok: boolean}>(`${base_url}/abonados`, formaData, this.headers);
  }

  /** ================================================================
   *  ADD CLIENT ABONADO
  ==================================================================== */
  addClientAbonado( client: string, id: string ){
    return this.http.post<{abonado: Abonado, ok: boolean}>(`${base_url}/abonados/add/${client}/${id}`, '', this.headers);
  }

  /** ================================================================
   *  DEL CLIENT ABONADO
  ==================================================================== */
  delClientAbonado(client: string, id: string){
    return this.http.delete<{abonado: Abonado, ok: boolean}>(`${base_url}/abonados/del/${client}/${id}`, this.headers);
  }
  
  /** ================================================================
   *  UPDATE ABONADO
  ==================================================================== */
  updateAbonado( formData: any, id: string ){
    return this.http.put< { abonado: Abonado, ok: boolean } >(`${base_url}/abonados/${id}`, formData, this.headers);
  }




  // FIN DE LA CLASE
}
