import { Injectable } from '@angular/core';

// ENVIRONMENT
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pagina } from '../models/paginas.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PaginasService {

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
   *   CREATE PAGINA
  ==================================================================== */
  createPagina(archivo: File, total: number, copia: number, scaner: number, product: string){

    const url = `${base_url}/paginas/create/${product}`;
    const formData = new FormData();
    formData.append('image', archivo);
    formData.append('total', total.toString());
    formData.append('copia', copia.toString());
    formData.append('scaner', scaner.toString());

    return this.http.post<{ok: boolean, pagina: Pagina}>(url, formData, this.headers);

  }

  /** ================================================================
   *   GET QUERY PAGINA
  ==================================================================== */
  loadPaginasQuery(query: any){
    return this.http.post<{ok: boolean, paginas: Pagina[], total: number}>( `${base_url}/paginas/query`, query, this.headers );
  }

}
