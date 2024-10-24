import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from 'src/app/models/clients.model';
import { Product } from 'src/app/models/products.model';
import { ClientsService } from 'src/app/services/clients.service';
import { ProductsService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-client',
  templateUrl: './assign-client.component.html',
  styleUrls: ['./assign-client.component.css']
})
export class AssignClientComponent implements OnInit {

  @Input() productC!: Product;
  @Output() actualizar: EventEmitter<any> = new EventEmitter() ;

  constructor(  private clientsService: ClientsService,
                private searchService: SearchService,
                private productsService: ProductsService) { }

  ngOnInit(): void {
  }

  /** ======================================================================
   * LOAD CLIENTS
  ====================================================================== */
  public clients: Client[] = [];
  public resultadoC: number = 0;
  public sinResultadoC: boolean = false;
  searchClients(termino: string){
    
    this.sinResultadoC = false;
    if (termino.length === 0) {
      this.clients = [];
      this.resultadoC = 0;
      return;
    }   

    this.searchService.search('clients', termino, '')
        .subscribe( ({resultados}) => {

          this.clients = resultados;
          this.resultadoC = resultados.length;
          
          if (this.resultadoC === 0) {
            this.sinResultadoC = true;
          }

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  /** ======================================================================
   * ASSIGN CLIENTS
  ====================================================================== */  
  assignClient(client: any, estado: 'Instalada' | 'Mantenimiento' | 'Disponible'){
  
    let body = {
      client: client.cid,
      estado,
      cliente: true
    };

    this.productsService.updateClientProduct(this.productC.pid! , body)
        .subscribe( ({product}) => {

          this.actualizar.emit(product);
          

          // this.loadProducts();
          Swal.fire('Estupendo', 'Hemos asignado el cliente correctamente!', 'success');

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });
    

  }

  /** ======================================================================
   * GUARDAR UBICACION
  ====================================================================== */ 
  updateUbicacion(ubicacion: string){

    if (ubicacion.length === 0) {
      Swal.fire('Atención', 'Debes de agregar una ubicación para actualizar', 'warning');
      return;
    }

    let body = {
      ubicacion
    };

    this.productsService.updateClientProduct(this.productC.pid! , body)
        .subscribe( ({product}) => {

          this.actualizar.emit(product);
          

          // this.loadProducts();
          Swal.fire('Estupendo', 'Se ha actualizado la ubicacion exitosamente!', 'success');

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }

}
