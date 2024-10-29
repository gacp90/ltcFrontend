import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

// MODELS
import { Product } from '../models/products.model';
import { Inventory } from '../models/inventory.model';

// INTERFACES
import { LoadProducts } from '../interfaces/load-products.interface';
import { LoadInventory } from '../interfaces/load-inventory.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

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
   *   LOAD PRODUCTS
  ==================================================================== */
  loadProducts(query: any){
    return this.http.post<LoadInventory>( `${base_url}/inventory/query`, query, this.headers );
  }

  /** ================================================================
   *   GET PRODUCT ID
  ==================================================================== */
  loadProductId(id: string){
    return this.http.get<{product: Inventory, ok: boolean}>(`${base_url}/inventory/${id}`, this.headers);
  }

  /** ================================================================
   *   GET PRODUCT ID
  ==================================================================== */
  loadProductCode(code: string){
    return this.http.get<{product: Inventory, ok: boolean}>(`${base_url}/inventory/codigo/${code}`, this.headers);
  }

  /** ================================================================
   *   GET PRODUCTS OF CLIENTS
  ==================================================================== */
  loadProductsClient(client: string){
    return this.http.get<{ products: Inventory[], ok: boolean }>(`${base_url}/inventory/client/${client}`, this.headers);
  }

  /** ================================================================
   *   GET COUNT PRODUCTS PREFIX
  ==================================================================== */
  loadProductsPrefix(prefix: string){
    return this.http.get<{ total: number, ok: boolean }>(`${base_url}/inventory/count/${prefix}`, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS
  ==================================================================== */
  createProduct( formData: any ){
    return this.http.post<{ok: boolean, product: Inventory}>(`${base_url}/inventory`, formData, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS EXCEL
  ==================================================================== */
  createProductExcel( formData: any ){
    return this.http.post<{ok: boolean, total: number}>(`${base_url}/inventory/create/excel`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE PRODUCTS
  ==================================================================== */
  updateProduct( formData:any, id: string ){
    return this.http.put<{ok: boolean, product: Inventory}>(`${base_url}/inventory/${id}`, formData, this.headers);
  }
  
  /** ================================================================
   *   UPDATE STATUS PRODUCTS
  ==================================================================== */
  changeStatus(pid: string){
    return this.http.delete<{ok: boolean, product: Inventory}>(`${base_url}/inventory/${pid}`, this.headers)
  }

  // FIN DE LA CLASE
}
