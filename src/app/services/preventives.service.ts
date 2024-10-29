import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { Preventive } from '../models/preventives.model';

// INTERFACES
import { LoadPreventives } from '../interfaces/load-preventives';


import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PreventivesService {

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
   *   LOAD PREVENTIVES
  ==================================================================== */
  loadPreventives(desde: number, limite: number){
    return this.http.get<LoadPreventives>(`${base_url}/preventives?desde=${desde}&limite=${limite}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVE ID
  ==================================================================== */
  loadPreventiveId(id: string){
    return this.http.get<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/${id}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVES FOR STAFF /staff/:staff
  ==================================================================== */
  loadPreventivesStaff(id: string, estado: 'Pendiente' | 'Terminado', query: string = ''){
    return this.http.get<LoadPreventives>(`${base_url}/preventives/staff/${id}?estado=${estado}&${query}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVES FOR STAFF /staff/:staff
  ==================================================================== */
  loadPreventivesProduct(id: string, estado: 'Pendiente' | 'Terminado', query: string = ''){
    return this.http.get<LoadPreventives>(`${base_url}/preventives/product/${id}?estado=${estado}&${query}`, this.headers);
  }

  /** ================================================================
   *   CREATE PREVENTIVES
  ==================================================================== */
  createPreventives( formData: any ){
    return this.http.post<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives`, formData, this.headers);
  }

  /** ================================================================
   *   POST NOTES
  ==================================================================== */
  postNotes( formData: any, id: string ){
    return this.http.post<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/notes/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE PREVENTIVES
  ==================================================================== */
  updatePreventives( formData: any, id:string ){
    return this.http.put<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE ITEMS PREVENTIVES
  ==================================================================== */
  updateItemsPreventives( formData: any, id:string ){
    return this.http.put<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/items/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   DELETE PREVENTIVES
  ==================================================================== */
  deletePreventive( id:string ){
    return this.http.delete<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/${id}`, this.headers);
  }

  /** ================================================================
   *   DELETE NOTE PREVENTIVE
  ==================================================================== */
  deleteNotePreventive( id:string, note: string ){
    return this.http.delete<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/delete/note/${id}/${note}`, this.headers);
  }

  /** ================================================================
   *   DELETE NOTE PREVENTIVE
  ==================================================================== */
  deleteItemPreventive( id:string, item: any ){
    return this.http.put<{ok: boolean, preventive: Preventive}>(`${base_url}/preventives/delete/item/${id}`, item, this.headers);
  }

  // FIN DE LA CLASE
}
