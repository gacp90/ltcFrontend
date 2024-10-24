import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Abonado } from 'src/app/models/abonado.model';

// SERVICES
import { AbonadosService } from 'src/app/services/abonados.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonados',
  templateUrl: './abonados.component.html',
  styles: [
  ]
})
export class AbonadosComponent implements OnInit {

  constructor(  private fb: FormBuilder,
                private abonadosService: AbonadosService) { }

  ngOnInit(): void {

    // CARGAR ABONADOS
    this.LoadAbonados();
  }

  /** ======================================================================
   * LOAD ABONADOS
  ====================================================================== */
  public abonados: Abonado[] = [];
  public total: number = 0;

  LoadAbonados(){

    this.abonadosService.loadAbonados()
        .subscribe( ({abonados, total}) => {

          this.abonados = abonados;
          this.total = total;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }

  /** ======================================================================
   * CREATE USER
  ====================================================================== */
  @ViewChild('modalNewUser') modalNewUser!: ElementRef;

  public formNewSubmitted: boolean = false;
  public formNewUser = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  createUser(){
       
    this.formNewSubmitted = true;   
    
    if (this.formNewUser.invalid) {
      return;
    }
    
    if (this.formNewUser.value.role === 'none') {
      return;      
    }
    
    this.abonadosService.createAbonado(this.formNewUser.value)
    .subscribe( ({abonado}) => {
      
      this.abonados.push(abonado);
      
      this.formNewUser.reset({
        role: 'none'
      });

      this.formNewSubmitted = false;
      
      Swal.fire('Estupendo', 'El nuevo abonado se creo con exito!', 'success');
      
      // // CERRAR MODAL 
      // // document.getElementById('add-user')?.classList.remove('show');
      // this.modalNewUser.nativeElement.classList.remove('show');      
      // let mod = document.querySelector('.modal-backdrop');
      // let del = mod?.parentNode;
      // del?.removeChild(mod!);

    }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }
  
  /** ======================================================================
   * VALIDATE FORM
  ====================================================================== */
  validate( campo: string): boolean{
    
    if ( this.formNewUser.get(campo)?.invalid && this.formNewSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }

}
