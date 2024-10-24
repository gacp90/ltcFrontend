import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { SwiperOptions } from 'swiper';
import Swal from 'sweetalert2';

// MODELS
import { Preventive } from 'src/app/models/preventives.model';

// SERVICES
import { PreventivesService } from '../../services/preventives.service';
import { SearchService } from '../../services/search.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/users.model';
import { Inventory } from 'src/app/models/inventory.model';
import { LogProduct } from 'src/app/models/logproducts.model';
import { LogproductsService } from 'src/app/services/logproducts.service';


@Component({
  selector: 'app-preventivo',
  templateUrl: './preventivo.component.html',
  styleUrls: ['./preventivo.component.css']
})

export class PreventivoComponent implements OnInit {

  public user!: User;

  constructor(  private activatedRoute: ActivatedRoute,
                private preventivesService: PreventivesService,
                private searchService: SearchService,
                private fb: FormBuilder,
                private logProductsService: LogproductsService,
                private fileUploadService: FileUploadService,
                private usersService: UsersService) { 
                  this.user = this.usersService.user;
                }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe( ({id}) => {
          
          this.loadPreventiveId(id);
          
        });

  };

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
   *  LOAD PREVENTIVE ID
  ==================================================================== */
  private _preventive!: Preventive;
  public imgsbefore: boolean = false;
  public imgsafter: boolean = false;

  public get preventive(): Preventive {
    return this._preventive;
  }

  public set preventive(value: Preventive) {
    this._preventive = value;
  }
  
  loadPreventiveId(id: string){

    this.preventivesService.loadPreventiveId(id)
        .subscribe( ({preventive}) => {

          this.preventive = preventive;

          if (preventive.imgBef.length > 0) {
            this.imgsbefore = true;
          }

          if (preventive.imgAft.length > 0) {
            this.imgsafter = true;
          }

          document.title = `Preventivo #${preventive.control} - LTC System`;
          this.loadLogs(preventive.product._id);
          

        });

  }

  /** ================================================================
   *  UPDATE CHECKIN - CHECKOUT
  ==================================================================== */
  updateCheck(tipo: 'checkin' | 'checkout'){
    
    let data:any;
    let text = 'de marcar el checkin ahora?';
    let confirmButtonText = 'Si, checkIn';
    let msg = 'El checkIn se a actualizado exitosamente!';

    if(tipo === 'checkin'){
      data = {
        checkin: Date.now()
      }
    }else{
      data = {
        checkout: Date.now(),
        estado: 'Terminado',
        check: true,
        frecuencia: this.preventive.product.frecuencia || 3
      }
      msg = 'El checkOut se a actualizado exitosamente!';
      text = 'de marcar la checkout ahora?';
      confirmButtonText = 'Si, checkOut';
    }

    Swal.fire({
      title: 'Estas seguro?',
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText
    }).then((result) => {
      
      if (result.isConfirmed) {

        this.preventivesService.updatePreventives(data, this.preventive.preid!)
        .subscribe( ({preventive}) => {

          this.preventive.checkin = preventive.checkin;
          this.preventive.checkout = preventive.checkout;
          this.preventive.estado = preventive.estado;
          Swal.fire('Estupendo', msg, 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Erro', err.error.msg, 'error');          
        });

      }

    })

    

  };

  /** ================================================================
   *  FINALIZAR O ABRIR MANTENIMIENTO
  ==================================================================== */
  updateEstado(estado: string){

    if (estado === 'Pendiente') {
      estado = 'Terminado';
    }else{
      estado = 'Pendiente';
    }

    this.preventivesService.updatePreventives( {estado}, this.preventive.preid! )
        .subscribe( ({ preventive }) => {

          Swal.fire('Estupendo', 'Se ha actualizado el correctivo exitosamente!', 'success');
          this.preventive.estado = preventive.estado;

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** =====================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *  NOTAS - CREATE
  ====================================================================================== */
  @ViewChild('notaI') notaI!: ElementRef;
  public formsNoteSubmitted: boolean = false;
  public formNotes =  this.fb.group({
    note: ['', [Validators.minLength(1), Validators.required]],
    date: ['']
  });

  postNota(){

    this.notaI.nativeElement.value = '';
    this.formsNoteSubmitted = true;

    if (this.formNotes.invalid) {
      return;
    }

    // AGREGAR FECHA
    this.formNotes.value.date = Date.now();

    this.preventivesService.postNotes(this.formNotes.value, this.preventive.preid!)
        .subscribe( ({preventive}) =>{
          
          this.formsNoteSubmitted = false;
          this.formNotes.reset();

          this.preventive.notes = preventive.notes;
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
    
  }

  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validate( campo: string): boolean{
    
    if ( this.formNotes.get(campo)?.invalid && this.formsNoteSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }


  /** ================================================================
   *  ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   * ======================================================================================
   *   ACTUALIZAR IMAGEN
  ==================================================================== */
  public imgTempBef: any = null;
  public imgTempAft: any = null;
  public subirImagen!: File;
  cambiarImage(file: any, type: 'before' | 'after'): any{

    this.subirImagen = file.files[0];
    
    if (!this.subirImagen) {  
      if (type === 'before') {        
        return this.imgTempBef = null;      
      }else if (type === 'after') {
        return this.imgTempAft = null; 
      }      
    }
    
    let fileTemp = this.subirImagen;

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(fileTemp);
    
    reader.onloadend = () => {

      if (type === 'before') {       
        this.imgTempBef = reader.result;
      }else if (type === 'after') {
        this.imgTempAft = reader.result;
      }
    }    

  }
      
  /** ================================================================
   *  SUBIR IMAGEN fileImg
  ==================================================================== */
  @ViewChild('fileImgBef') fileImgBef!: any;
  @ViewChild('fileImgAft') fileImgAft!: any;

  public imgProducto: string = 'no-image';

  subirImg(desc: 'imgBef' | 'imgAft' | 'video'){
    
    this.fileUploadService.updateImage( this.subirImagen, 'preventives', this.preventive.preid!, desc)
    .then( img => {
      
      if (desc === 'imgBef') {
        this.preventive.imgBef?.push({
          img: img.nombreArchivo,
          date: img.date
        });
        this.imgsbefore = true;
      }else if(desc === 'imgAft'){
        this.preventive.imgAft?.push({
          img: img.nombreArchivo,
          date: img.date
        });
        this.imgsafter = true;
      }

      
    });
    
    this.imgProducto = 'no-image';
    
    if (desc === 'imgBef') {
      this.imgTempBef = null;
      this.fileImgBef!.nativeElement.value = '';
    }else if(desc === 'imgAft'){
      this.imgTempAft = null;
      this.fileImgAft!.nativeElement.value = '';
    }
    
  }

  /** ================================================================
   *  DELETE IMAGEN fileImg
  ==================================================================== */
  deleteImg(img:string, desc: 'imgBef' | 'imgAft', type: 'preventives' | 'correctives' = 'preventives'){

    this.fileUploadService.deleteImg(type, this.preventive.preid!, desc, img)
        .subscribe( (resp:any) => {
          
          this.preventive.imgAft = resp.preventive.imgAft;
          this.preventive.imgBef = resp.preventive.imgBef;

          if (this.preventive.imgBef.length > 0) {
            this.imgsbefore = true;
          }  

          if (this.preventive.imgAft.length > 0) {
            this.imgsafter = true;
          }

          Swal.fire('Estupendo', 'Se ha eliminado la imagen con exito', 'success');
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
          
        });
    

  }

  /** ================================================================
   *  DELETE NOTE
  ==================================================================== */
  deleteNote(note: string){

    Swal.fire({
      title: "Estas seguro?",
      text: "De borrar este comentario!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.preventivesService.deleteNotePreventive(this.preventive.preid!, note)
            .subscribe( ({preventive}) => {

              this.preventive.notes = preventive.notes;
              Swal.fire('Estupendo', 'Se ha borrado el comentario exitosamente!', 'success');

            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');              
            });

      }
    });
    

  }

  /** ===================================================================
   * SEARCH ITEMS
  ======================================================================= */
  public items: Inventory[] = [];
  searchItems(termino: string){

    let query = `desde=${0}&hasta=${50}`;

    if (termino.length === 0) {
      this.items = []
      return;
    }
    
    this.searchService.search('inventory', termino, query)
        .subscribe( ({resultados}) => {
          this.items = resultados;
        });   

  }

  /** ===================================================================
   * SELECT ITEM
  ======================================================================= */
  @ViewChild('searchII') searchII!: ElementRef;
  selectItem(item: Inventory){

    this.addItemForm.setValue({
      qty: this.addItemForm.value.qty,
      sku: item.sku,
      type: 'Salida',
      description: item.name,
    })

    this.items = [];
    this.searchII.nativeElement.value = '';

  }


  /** ===================================================================
   * ADD ITEMS
  ======================================================================= */
  @ViewChild('btnAI') btnAI!: ElementRef;
  public addItemSubmitted: boolean = false;
  public addItemForm = this.fb.group({
    qty: ['', [Validators.required, Validators.min(1)]],
    sku: ['', [Validators.required]],
    type: ['Salida', [Validators.required]],
    description: ['', [Validators.required]],
  })

  addItem(){

    this.addItemSubmitted = true;

    if (this.addItemForm.invalid) {
      return;
    }

    if (this.addItemForm.value.qty <= 0) {
      Swal.fire('Atención', 'Debes de agregar una cantidad validad', 'warning');
      return;
    }

    this.preventivesService.updateItemsPreventives(this.addItemForm.value, this.preventive.preid!)
        .subscribe( ({preventive}) => {

          this.preventive.items = preventive.items;
          Swal.fire('Estupendo', 'Se agrego el item exitosamente', 'success');

          this.addItemSubmitted = false;
          this.addItemForm.reset({
            type: 'Salida'
          });

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ===================================================================
   * VALIDATE ADD ITEMS
  ======================================================================= */
  validateFormItems(campo:string): boolean{

    if (this.addItemSubmitted && this.addItemForm.get(campo)?.invalid) {
      return true;
    }else{
      return false;
    }

  }

  /** ===================================================================
   * SWIPER
  ======================================================================= */
  public config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    centeredSlides: true,
    breakpoints: {
      100: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 3,
        spaceBetween: 50
      }
    }
  };


  // FIN DE LA CLASE
}
