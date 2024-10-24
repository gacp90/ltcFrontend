import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';

// MODELS
import { Product } from '../models/products.model';

// INTERFACES
import { LoadProducts } from '../interfaces/load-products.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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
  loadProducts(desde: number, limite: number, query: string = ''){
    return this.http.get<LoadProducts>( `${base_url}/products?desde=${desde}&limite=${limite}&${query}`, this.headers );
  }

  /** ================================================================
   *   GET PRODUCT ID
  ==================================================================== */
  loadProductId(id: string){
    return this.http.get<{product: Product, ok: boolean}>(`${base_url}/products/${id}`, this.headers);
  }

  /** ================================================================
   *   GET PRODUCTS OF CLIENTS
  ==================================================================== */
  loadProductsClient(client: string){
    return this.http.get<{ products: Product[], ok: boolean }>(`${base_url}/products/client/${client}`, this.headers);
  }

  /** ================================================================
   *   GET COUNT PRODUCTS PREFIX
  ==================================================================== */
  loadProductsPrefix(prefix: string){
    return this.http.get<{ total: number, ok: boolean }>(`${base_url}/products/count/${prefix}`, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS
  ==================================================================== */
  loadProductsQuery( query: any ){
    return this.http.post<{ok: boolean, products: Product[], total: number}>(`${base_url}/products/query`, query, this.headers);
  }

  /** ================================================================
   *   CREATE PRODUCTS
  ==================================================================== */
  createProduct( formData: any ){
    return this.http.post<{ok: boolean, product: Product}>(`${base_url}/products`, formData, this.headers);
  }

  /** ================================================================
   *   UPDATE PRODUCTS
  ==================================================================== */
  updateProduct( formData:any, id: string ){
    return this.http.put<{ok: boolean, product: Product}>(`${base_url}/products/${id}`, formData, this.headers);
  }
  /** ================================================================
   *   UPDATE CLIENT PRODUCTS product
client
change
  ==================================================================== */
  updateClientProduct(
    product: string,
    body: any
  ){
    return this.http.put<{ ok: boolean, product: Product }>(`${base_url}/products/${product}/change`, body, this.headers);
  }


  // FIN DE LA CLASE
}
