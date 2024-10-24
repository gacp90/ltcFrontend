import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

// SERVICES
import { SearchService } from '../../services/search.service';
import { CorrectivesService } from '../../services/correctives.service';

// MODELS
import { Corrective } from '../../models/correctives.model';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users.model';

@Component({
  selector: 'app-correctivos',
  templateUrl: './correctivos.component.html',
  styles: [
  ]
})
export class CorrectivosComponent implements OnInit {

  public user!: User;

  constructor(  private correctivesServices: CorrectivesService,
                private searchService: SearchService,
                private fb: FormBuilder,
                private usersService:UsersService) { 
                  this.user = usersService.user;
                }

  ngOnInit(): void {

    this.loadCorrectives();

  }

  /** ======================================================================
   * LOAD USERS
  ====================================================================== */
  public desde:number = 0;
  public limite:number = 50;
  public correctives: Corrective[] = [];
  public correctivesTemp: Corrective[] = [];
  public total: number = 0;
  public cargando: boolean = false;
  public sinResultados: boolean = false;

  public query: any = {
    desde: 0,
    hasta: 50,
    status: true,
    sort: {
      'estado': 1,
      'date': 1
    }
  }  

  loadCorrectives(){

    this.cargando = true;
    this.sinResultados = false;

    this.correctivesServices.loadCorrectivesQuery(this.query)
        .subscribe( ({ correctives, total }) => {   

          // COMPROBAR SI EXISTEN RESULTADOS
          if (correctives.length === 0) {
            this.sinResultados = true;           
          }
          // COMPROBAR SI EXISTEN RESULTADOS

          this.cargando = false;
          this.total = total;
          this.correctives = correctives;
          this.correctivesTemp = correctives;          

        }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  }

  // loadCorrectives(){

  //   this.cargando = true;
  //   this.sinResultados = false;

  //   this.correctivesServices.loadCorrectives(this.desde, this.limite)
  //       .subscribe( ({ correctives, total }) => {

  //         console.log(correctives);
          

  //         // COMPROBAR SI EXISTEN RESULTADOS
  //         if (correctives.length === 0) {
  //           this.sinResultados = true;           
  //         }
  //         // COMPROBAR SI EXISTEN RESULTADOS

  //         this.cargando = false;
  //         this.total = total;
  //         this.correctives = correctives;
  //         this.correctivesTemp = correctives;          

  //       }, (err) => { Swal.fire('Error', err.error.msg, 'error'); });

  // }


  /** ======================================================================
   * SEARCH
  ====================================================================== */
  public resultados: number = 0;
  search( termino:string ){

    let query = `desde=${this.desde}&hasta=${this.limite}`;

    if (termino.length === 0) {
      this.correctives = this.correctivesTemp;
      this.resultados = 0;
      return;
    }
    
    this.searchService.search('correctives', termino, query)
        .subscribe( ({resultados}) => {

          this.correctives = resultados;
          this.resultados = resultados.length;

        });   

  }

  /** ================================================================
   *   CAMBIAR PAGINA
  ==================================================================== */
  @ViewChild('mostrar') mostrar!: ElementRef;
  cambiarPagina (valor: number){
        
    this.query.desde += valor;

    if (this.query.desde < 0) {
      this.query.desde = 0;
    }
    
    this.loadCorrectives();
    
  }

  /** ================================================================
   *   CHANGE LIMITE
  ==================================================================== */
  limiteChange( cantidad: any ){    

    this.query.hasta = Number(cantidad);
    this.loadCorrectives();

  }

  /** ================================================================
   *   CHANGE ESTADO
  ==================================================================== */
  estadoChange( estado: string ){

    this.query.estado = estado;

    if (estado === 'Todos') {
      delete this.query.estado;
    }

    this.loadCorrectives();

  }

  /** ================================================================
   *   CHANGE ESTADO 
   *   Primeros
      Ultimos
      'date': 1
  ==================================================================== */
  ordenChange(orden: string ){

    if (orden === 'Primeros') {
      this.query.sort.date = 1
    }else if (orden === 'Ultimos') {
      this.query.sort.date = -1
    }

    this.loadCorrectives();

  }

  /** ================================================================
   *   DELETE CORRECTIVE
  ==================================================================== */
  deleteCorrective(coid: any){

    this.correctivesServices.deleteCorrective(coid)
        .subscribe( ({corrective}) => {

          this.correctives.map( (corr) => {

            if (corrective.coid === corr.coid) {
              corr.status = corrective.status;
            }

          })

          if (corrective.status) {
            Swal.fire('Estupendo', 'Se a activado el correctivo exitosamente!', 'success');
          }else{
            Swal.fire('Estupendo', 'Se a eliminado el correctivo exitosamente!', 'success');
          }

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

}
