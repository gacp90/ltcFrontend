import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { AbonadosService } from '../../services/abonados.service';
import { Abonado } from 'src/app/models/abonado.model';
import { SearchService } from 'src/app/services/search.service';
import { Client } from 'src/app/models/clients.model';

@Component({
  selector: 'app-abonado',
  templateUrl: './abonado.component.html',
  styles: [
  ]
})
export class AbonadoComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private abonadosService: AbonadosService,
                private searchService: SearchService,
                private router: Router,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => {
          
          if (id) {
            this.loadAbonado(id);
          }else{

            this.router.navigateByUrl('/');

          }
          
        });

  }

  /** ================================================================
   *  CARGAR ABONADOS
  ==================================================================== */
  public abonado!: Abonado;

  loadAbonado(id:string){

    this.abonadosService.loadAbonadoId(id)
        .subscribe( ({abonado}) => {

          this.abonado = abonado;
          
        }, (err) => {
          console.log(err);
          Swal.fire('Erro', err.error.msg, 'error');
          this.router.navigateByUrl('/');
          
        });

  }

  /** ======================================================================
   * SEARCH CLIENTS
  ====================================================================== */
  public resultados: number = 0;
  public clients: Client[] = [];

  search( termino:string ){

    let query = `desde=${0}&hasta=${10000}`;

    if (termino.length === 0) {
      this.clients = [];
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('clients', termino, query)
        .subscribe( ({resultados}) => {

          this.clients = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ================================================================
   *  AGREGAR CLIENTES AL ABONADO
  ==================================================================== */
  addClient(client: string){

    // VALIDAR CLIENTE
    const validClient = this.abonado.clients.findIndex( (resp) => {
      
      if (resp.client._id === client){  
        return true;
      }else {
        return false;
      }
    });
    
    if (validClient !== -1) {
      Swal.fire('Atención', 'Este cliente ya a sido agregado anteriormente', 'warning');
      return;
    }
    // VALIDAR CLIENTE

    if (!client) {
      Swal.fire('Error', 'Debes de seleccionar un cliente', 'error');
      return;
    }

    this.clients = [];


    this.abonadosService.addClientAbonado(client, this.abonado.aid)
        .subscribe( ({abonado}) => {

          this.abonado.clients = abonado.clients;          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          return;          
        });

  }

  /** ================================================================
   *  ELIMINAR CLIENTES AL ABONADO
  ==================================================================== */
  delClient( client: string ){

    this.abonadosService.delClientAbonado(client, this.abonado.aid)
        .subscribe( ({abonado}) => {

          this.abonado.clients = abonado.clients;          

        },(err) => { 
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
    

  }


  // FIN DE LA CLASE
}
