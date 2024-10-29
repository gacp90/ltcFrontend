import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// MODELS
import { Product } from 'src/app/models/products.model';
import { Preventive } from 'src/app/models/preventives.model';
import { Corrective } from 'src/app/models/correctives.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';
import { LogproductsService } from 'src/app/services/logproducts.service';
import { LogProduct } from 'src/app/models/logproducts.model';
import { PaginasService } from 'src/app/services/paginas.service';
import { Pagina } from 'src/app/models/paginas.model';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  public local_url = environment.local_url;

  constructor(  private activatedRoute: ActivatedRoute,
                private productsService: ProductsService,
                private preventivesService: PreventivesService,
                private logProductsService: LogproductsService,
                private correctivesService: CorrectivesService,
                private paginasService: PaginasService,
                private router: Router) { }

  ngOnInit(): void {

    // this.activatedRoute.params
    //     .subscribe( ({id}) =>  {
    //       this.loadProduct(id);          
    //     });

    this.loadProduct();

  }


  /** ================================================================
   *  LOAD PAGINAS
  ==================================================================== */
  public paginas: Pagina[] = [];
  public totalPaginas: number = 0;
  public queryP:any = {
    desde: 0,
    hasta: 10,
    sort: {
      fecha: -1
    }
  }

  loadPaginas(product: string){

    this.queryP.product = product;

    this.paginasService.loadPaginasQuery( this.queryP )
        .subscribe( ({paginas, total}) => {

          this.paginas = paginas;
          this.totalPaginas = total;

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  LOAD LOG PRODUCTS
  ==================================================================== */
  public logProducts: LogProduct[] = [];
  loadLogs(product: string){

    let query = {
      product,
      desde: 0,
      hasta: 10,
      sort: { fecha: -1}
    }

    this.logProductsService.loadLogProducts(query)
        .subscribe( ({logproducts}) => {

          this.logProducts = logproducts;         

        }, (err)=> {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })


  }

  /** ================================================================
   *  LOAD PRODUCT ID
  ==================================================================== */
  public product: Product | any;
  loadProduct(){

    this.activatedRoute.params
        .subscribe( ({id}) =>  {      
        

          this.productsService.loadProductId(id)
              .subscribe( ({product}) => {

                this.product = product;
                
                this.loadPreventives();
                this.loadCorrectives();
                this.loadLogs(product.pid!);
                this.loadPaginas(product.pid!);

              }, (err) => {
                Swal.fire('Error', err.error.msg, 'error');
                this.router.navigateByUrl('/');
                
              });

      });

  }

  /** ================================================================
   *  LOAD PREVENTIVES
  ==================================================================== */
  public estadoPreventive: any = 'Pendiente';
  public preventives: Preventive[] = [];
  loadPreventives(){

    this.preventivesService.loadPreventivesProduct(this.product.pid, this.estadoPreventive)
        .subscribe( ({preventives}) => {

          this.preventives = preventives;
          
        });

  }

  /** ================================================================
   *  LOAD CORRECTIVES
  ==================================================================== */
  public estadoCorrective: any = 'Pendiente';
  public correctives: Corrective[] = [];

  loadCorrectives(){

    this.correctivesService.loadCorrectivesProduct(this.product.pid, this.estadoCorrective)
        .subscribe( ({ correctives }) => {

          this.correctives = correctives;
          
        });

  }

  /** ================================================================
   *   ACTUALIZAR IMAGEN
  ==================================================================== */
  public imgTempP: any = null;
  public subirImagen!: any;
  cambiarImage(file: any): any{  
    
    this.subirImagen = file.target.files[0];
    
    if (!this.subirImagen) { 
      console.log('No existe imagen');
      
      return this.imgTempP = null 
    }    
    
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file.target.files[0]);
        
    reader.onloadend = () => {
      this.imgTempP = reader.result;      
    }

  }

  /** ================================================================
   *  SUBIR IMAGEN
  ==================================================================== */
  @ViewChild('fileImg') fileImg!: ElementRef;
  @ViewChild('totalP') totalP!: ElementRef;
  public imgPerfil: string = 'no-image';
  crearPagina(total: any, copia: any, scaner: any){

    total = Number(total);
    copia = Number(copia);
    scaner = Number(scaner);

    if (total.length < 0) {
      Swal.fire('Atención', 'debes de agregar una cantidad valida de paginas impresas', 'warning');
      return;
    }
    if (copia.length < 0) {
      Swal.fire('Atención', 'debes de agregar una cantidad valida de paginas impresas', 'warning');
      return;
    }
    if (scaner.length < 0) {
      Swal.fire('Atención', 'debes de agregar una cantidad valida de paginas impresas', 'warning');
      return;
    }

    if (!this.subirImagen) {
      Swal.fire('Atención', 'debes de agregar una imagen', 'warning');
      return;
    }   

    this.paginasService.createPagina( this.subirImagen, total, copia, scaner, this.product.pid!)
        .subscribe( ({pagina}) => {

          this.paginas.unshift(pagina);
          this.fileImg.nativeElement.value = '';
          this.totalP.nativeElement.value = '';
          this.imgTempP = null;
          Swal.fire('Estupendo', 'se ha creado el registro existosamente', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        })
    
  }

  

  
  // FIN DE LA CLASE
}
