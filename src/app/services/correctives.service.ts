import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// MODELS
import { Corrective } from '../models/correctives.model';

// INTERFACES
import { LoadCorrectives } from '../interfaces/load-correctives.interface';


import { environment } from '../../environments/environment.prod';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CorrectivesService {

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
   *   LOAD CORRECTIVES
  ==================================================================== */
  loadCorrectives(desde: number = 0, limite: number = 10){
    return this.http.get<LoadCorrectives>(`${base_url}/correctives?desde=${desde}&limite=${limite}`, this.headers);
  }

  /** ================================================================
   *   LOAD CORRECTIVE ID
  ==================================================================== */
  loadCorrectiveId(id: string){
    return this.http.get<{ corrective: Corrective, ok: boolean }>(`${base_url}/correctives/${id}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVES FOR STAFF /staff/:staff
  ==================================================================== */
  loadCorrectivesStaff(id: string, estado: 'Pendiente' | 'Terminado', query: string = ''){
    return this.http.get<LoadCorrectives>(`${base_url}/correctives/staff/${id}?estado=${estado}&${query}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVES FOR STAFF /staff/:staff
  ==================================================================== */
  loadCorrectivesProduct(id: string, estado: 'Pendiente' | 'Terminado', query: string = ''){
    return this.http.get<LoadCorrectives>(`${base_url}/correctives/product/${id}?estado=${estado}&${query}`, this.headers);
  }

  /** ================================================================
   *   LOAD PREVENTIVES QUERY
  ==================================================================== */
  loadCorrectivesQuery(query: any){
    return this.http.post<LoadCorrectives>(`${base_url}/correctives/query`, query, this.headers);
  }

  /** ================================================================
   *   CREATE CORRECTIVES
  ==================================================================== */
  createCorrectives(formData: any){
    return this.http.post<{corrective: Corrective, ok: boolean}>(`${base_url}/correctives`, formData, this.headers);
  }

  /** ================================================================
   *   POST NOTES
  ==================================================================== */
  postNotesCorrectives( formData: any, id: string ){
    return this.http.post<{ok: boolean, corrective: Corrective}>(`${base_url}/correctives/notes/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE CORRECTIVE
  ==================================================================== */
  updateCorrective(formData: any, id: string){
    return this.http.put<{corrective: Corrective, ok: boolean}>(`${base_url}/correctives/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE ITEMS CORRECTIVE
  ==================================================================== */
  updateItemsCorrective( formData: any, id:string ){
    return this.http.put<{ok: boolean, corrective: Corrective}>(`${base_url}/correctives/items/${id}`, formData, this.headers);
  }

  /** ================================================================
   *   DELETE CORRECTIVE
  ==================================================================== */
  deleteCorrective( id:string ){
    return this.http.delete<{ok: boolean, corrective: Corrective}>(`${base_url}/correctives/${id}`, this.headers);
  }

  /** ================================================================
   *   DELETE NOTE CORRECTIVE
  ==================================================================== */
  deleteNoteCorrective( id:string, note: string ){
    return this.http.delete<{ok: boolean, corrective: Corrective}>(`${base_url}/correctives/delete/note/${id}/${note}`, this.headers);
  }

  /** ================================================================
   *   DELETE NOTE CORRECTIVE
  ==================================================================== */
  deleteItemCorrective( id:string, item: any ){
    return this.http.put<{ok: boolean, corrective: Corrective}>(`${base_url}/correctives/delete/item/${id}`, item, this.headers);
  }


  // FIN DE LA CLASE
}
