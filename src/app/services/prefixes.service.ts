import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoadPrefix } from '../interfaces/load-prefix.interface';

import { Prefix } from '../models/prefix.model';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PrefixesService {

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
   *  LOAD PREFIXES
  ==================================================================== */
  loadPrefixes(){
    return this.http.get<LoadPrefix>( `${base_url}/prefixes`, this.headers );
  }

  /** ================================================================
   *  CREATE PREFIX
  ==================================================================== */
  createPrefix(formData: any){
    return this.http.post<{ok: Boolean, prefix: Prefix}>(`${base_url}/prefixes`, formData, this.headers);
  }

  /** ================================================================
   *  UPDATE PREFIX
  ==================================================================== */
  updatePrefix(formData: any, id: string){
    return this.http.put<({ok: Boolean, prefix: Prefix})>(`${base_url}/prefixes/${id}`, formData, this.headers);
  }

  // FIN DE LA CLASE
}
