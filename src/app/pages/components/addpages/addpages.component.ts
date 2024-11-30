import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Pagina } from 'src/app/models/paginas.model';
import { PaginasService } from 'src/app/services/paginas.service';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-addpages',
  templateUrl: './addpages.component.html',
  styleUrls: ['./addpages.component.css']
})
export class AddpagesComponent implements OnInit {

  public local_url = environment.local_url;
  @Input() productID!: string;

  constructor(  private paginasService: PaginasService,
                private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loadPaginas();
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

  loadPaginas(){

    this.queryP.product = this.productID;

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
   *  CREAR PAGINA SUBIR IMAGEN
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

    this.paginasService.createPagina( this.subirImagen, total, copia, scaner, this.productID!)
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

  /** ================================================================
   *  SETFORM
  ==================================================================== */
  public paginaUpdateId!: string;
  setForm(pagina: Pagina){

    this.paginaUpdateId = pagina.paid;

    this.updateForm.setValue({
      total: pagina.total,
      scaner: pagina.scaner,
      copia: pagina.copia
    })

  }

  /** ================================================================
   *  UPDATE PAGINA
  ==================================================================== */
  public updateFormSubmitted: boolean = false;
  public updateForm = this.fb.group({
    total: ['', [Validators.required]],
    scaner: ['', [Validators.required]],
    copia: ['', [Validators.required]]
  })

  update(){

    this.updateFormSubmitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.paginasService.updatePagina(this.updateForm.value, this.paginaUpdateId)
        .subscribe( ({pagina}) => {

          this.paginas.map( pag => {

            if (pag.paid === this.paginaUpdateId) {
              pag.total = pagina.total
              pag.scaner = pagina.scaner
              pag.copia = pagina.copia
              pag.qty = pagina.qty
              pag.qtys = pagina.qtys
              pag.qtyc = pagina.qtyc
            }

          })

          Swal.fire('Estupendo', 'Se ha actualizado el historial de pagina exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

}
