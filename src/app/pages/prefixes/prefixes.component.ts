import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Prefix } from 'src/app/models/prefix.model';
import { PrefixesService } from 'src/app/services/prefixes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-prefixes',
  templateUrl: './prefixes.component.html',
  styles: [
  ]
})
export class PrefixesComponent implements OnInit {

  constructor(  private fb: FormBuilder,
                private prefixesService: PrefixesService) { }

  ngOnInit(): void {

    // LOAD PREFIXES
    this.LoadPrefixes();
  }

  /** ======================================================================
   * LOAD PREFIXES
  ====================================================================== */
  public prefixSelect!: Prefix;
  public prefixes: Prefix[] = [];
  public total: number = 0;

  LoadPrefixes(){
    this.prefixesService.loadPrefixes()
        .subscribe( ({prefixes, total}) => {
          this.prefixes = prefixes;
          this.total = total;
        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });
  }

  /** ======================================================================
   * CREATE PREFIX
  ====================================================================== */
  public formSubmitted: boolean = false;
  public formCreate = this.fb.group({
    name: ['', [Validators.required]]
  });

  createPrefix(){

    this.formSubmitted = true;

    if (this.formCreate.invalid) {
      return;
    }

    this.prefixesService.createPrefix(this.formCreate.value)
        .subscribe( ({prefix}) => {

          this.formSubmitted = false;          
          this.prefixes.push(prefix);

          this.formCreate.reset();
          Swal.fire('Estupendo', 'Se ha creado el prefijo exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ======================================================================
   * VALIDAR FORM
  ====================================================================== */
  validate(campo: string): boolean{
    if (this.formCreate.get(campo)?.invalid && this.formSubmitted) {
      return true;     
    }else{
      return false;
    }
  }

  /** ======================================================================
   * UPDATE PREFIX
  ====================================================================== */
  updatePrefix(name: string){

    if (name.length === 0) {
      Swal.fire('Atención', 'El prefijo es obligatorio', 'warning');
      return;
    }

    this.prefixesService.updatePrefix({name}, this.prefixSelect.prefid!)
        .subscribe( ({prefix})=> {
          this.prefixSelect.name = name;
          this.LoadPrefixes();
          Swal.fire('Estupendo', 'Se ha actualizado el prefijo exitosamente', 'success');
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        });

  }


  // FIN DE LA CLASE
}
