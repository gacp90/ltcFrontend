import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import Swal from 'sweetalert2';

// SERVICES
import { SearchService } from '../../../services/search.service';
import { CorrectivesService } from '../../../services/correctives.service';

// MODELS
import { Product } from '../../../models/products.model';
import { User } from 'src/app/models/users.model';

@Component({
  selector: 'app-createcorrectives',
  templateUrl: './createcorrectives.component.html',
  styleUrls: ['./createcorrectives.component.css']
})
export class CreatecorrectivesComponent implements OnInit {
  
  @Input('inProduct') inProduct: any;

  constructor(  private searchService: SearchService,
                private correctivesService: CorrectivesService) { }

  ngOnInit(): void {

    if(this.inProduct){
      this.productSelect = this.inProduct;
      this.selectProd = true;
    }
  }

  /* ============================================================================
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  SEARCH PRODUCTS
  ============================================================================ */
  
  public resProductos: number = 0;
  public products: Product[] = [];
  public sinResultadoP: boolean = false;
  searchProducts(termino: string){

    this.sinResultadoP = false;
    if (termino.length === 0) {
      this.sinResultadoP = true;
      this.products = [];
      this.resProductos = 0;
      return;
    }
    

    let query = `desde=${0}&hasta=${10000}`;

    this.searchService.search('products', termino, query)
    .subscribe( ( {resultados, total} ) => {

        this.sinResultadoP = false;
        this.resProductos = total;
        this.products = resultados;
        
        
      }, (err) => { 
        this.sinResultadoP = true;
        Swal.fire('Error', err.error.msg, 'error'); 
      });
      
  };
      
  /* ============================================================================ 
  SELECT PRODUCTS
  ============================================================================ */
  @ViewChild('buscadorP') buscadorP!: ElementRef;
  public productSelect!: Product;
  public selectProd: boolean = false;
  selectProduct(product: Product){
    this.sinResultadoP = false;
    this.products = [];
    this.resProductos = 0;
    this.buscadorP.nativeElement.value = '';
    this.productSelect = product;
    this.selectProd = true;

  };

  /** ======================================================================
   * ASSIGN CLIENTS
  ====================================================================== */
  actualizarProduct(product: Product){
    this.productSelect = product;
  };

  /* ============================================================================
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  TENICOS
  ============================================================================ */
  public resStaff: number = 0;
  public staffs: User[] = [];
  public sinResultadoS: boolean = false;  
  searchStaffs(termino: string){

    this.sinResultadoP = false;
    if (termino.length === 0) {
      this.sinResultadoS = true;
      this.staffs = [];
      this.resStaff = 0;
      return;
    }
    

    let query = `desde=${0}&hasta=${10000}`;

    this.searchService.search('users', termino, query)
    .subscribe( ( {resultados, total} ) => {

        this.sinResultadoS = false;
        this.resStaff = total;
        this.staffs = resultados;
        
        
      }, (err) => { 
        this.sinResultadoS = true;
        Swal.fire('Error', err.error.msg, 'error'); 
    });
      
  };

  /*============================================================================ 
  SELECCIONAR TENICO
  ============================================================================ */
  @ViewChild('buscadorT') buscadorT!: ElementRef;
  public selectTech: boolean = false;
  public tecnico!: User;
  seleccionarTecnico( tecnico: User){

    this.selectTech = true;
    this.tecnico = tecnico;

    this.buscadorT.nativeElement.value = '';
    this.sinResultadoS = false;
    this.staffs = [];
    this.resStaff = 0;

  }

  /* ============================================================================
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  ============================================================================ 
  CREAR PREVENTIVE
  ============================================================================ */
  @Output() newCorrective: EventEmitter<any> = new EventEmitter();
  @ViewChild('description') description!: ElementRef;
  @ViewChild('solicitante ') solicitante !: ElementRef;

  createCorrective(){

    if (!this.selectProd) {
      Swal.fire('Error', 'No has seleccionado ningun producto', 'error')
      return;
    }

    if (!this.selectTech) {
      Swal.fire('Error', 'No has seleccionado ningun tecnico', 'error')
      return;
    }

    if (this.description.nativeElement.value.length < 6) {
      Swal.fire('Error', 'Debes de agregar una descripción', 'error');
      return;
    }

    let corrective = {
      staff: this.tecnico.uid,
      client: this.productSelect.client._id,
      product: this.productSelect.pid,
      description: this.description.nativeElement.value,
      solicitante: this.solicitante.nativeElement.value
    }

    this.correctivesService.createCorrectives(corrective)
        .subscribe( ({ corrective }) => {

          this.selectProd = false;
          this.selectTech = false;

          this.newCorrective.emit(corrective);

          this.description.nativeElement.value = '';

          Swal.fire('Esupendo', 'Se ha creado el Mantenimiento Correctivo exitosamente!', 'success');

        }, (err) => { 
          console.log(err);          
          Swal.fire('Error', err.error.msg, 'error'); 
        });

  };


  // FIN DE LA CLASE
}
