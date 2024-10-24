import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

// SERVICES
import { UsersService } from '../../services/users.service';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';

// MODELS
import { User } from '../../models/users.model';
import { Preventive } from '../../models/preventives.model';
import { Corrective } from '../../models/correctives.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private usersService: UsersService,
                private preventivesServices: PreventivesService,
                private correctivesService: CorrectivesService,
                private router: Router,
                private fb: FormBuilder) { 
                  
                  this.user = usersService.user;

                }

  ngOnInit(): void {

    
    
    this.activatedRoute.params
        .subscribe( ({id}) => {
          
          if ( this.user.uid !== id ) {

            if (this.user.role === 'ADMIN') {

              this.loadUser(id);

            }else{
              Swal.fire('Atención', 'No tienes los privilegios para estar aqui', 'warning');
              this.router.navigateByUrl('/');
              return;              
            }

          }else{
            this.loadPreventives();
            this.getForm();
          }   
          
        });

  }

  /** ================================================================
   *  CARGAR USUARIO
  ==================================================================== */
  public user!: User;

  loadUser(id:string){

    this.usersService.loadUserId(id)
        .subscribe( ({user}) => {

          this.user = user;
          this.getForm();        

          this.loadPreventives();
          this.loadCorrectives();

        });

  }

  /** ================================================================
   *  CARGAR PREVENTIVOS
  ==================================================================== */
  public preventives: Preventive[] = [];
  public estado: any = 'Pendiente';
  public total: number = 0;
  loadPreventives(){

    this.preventivesServices.loadPreventivesStaff(this.user.uid!, this.estado)
        .subscribe( ({ preventives, total }) => {

          this.total = total;
          this.preventives = preventives;

        });

  }

  /** ================================================================
   *  CARGAR CORRECTIVOS
  ==================================================================== */
  public correctives: Corrective[] = [];
  public estadoCorrective: any = 'Pendiente';
  public totalCorrectives: number = 0;
  loadCorrectives(){

    this.correctivesService.loadCorrectivesStaff(this.user.uid!, this.estadoCorrective)
        .subscribe( ({ correctives, total }) => {
          
          this.totalCorrectives = total;
          this.correctives = correctives;
          
        });

  }

  /** ================================================================
   *  GET FORM
  ==================================================================== */
  getForm(){

    this.formUpdate.reset({
      usuario: this.user.usuario,
      name: this.user.name,
      password: '',
      repassword: ''
    });

  }

  /** ================================================================
   *  ACTUALIZAR USUARIO
  ==================================================================== */
  public formUpdateSubmitted: boolean = false;
  public formUpdate = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', [Validators.minLength(6)]],
    repassword: ['', [Validators.minLength(6)]],
  });

  updateUser(){

    this.formUpdateSubmitted = true;

    if (this.formUpdate.invalid) {
      return;
    }

    if (this.formUpdate.value.password === '') {
      
      this.formUpdate.reset({
        usuario: this.formUpdate.value.usuario,
        name: this.formUpdate.value.name
      });
      
    }

    this.usersService.updateUser(this.formUpdate.value, this.user.uid!)
        .subscribe( ({user}) => {

          this.user = user;

          this.activatedRoute.params
          .subscribe( ({id}) =>{

            if (this.usersService.user.uid === id) {

              this.usersService.user.name = this.user.name;
              this.usersService.user.usuario = this.user.usuario;
              
            }

            Swal.fire('Estupendo', 'Se ha actualizado el perfil exitosamente!', 'success');

          }, (err) => {
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');            
          });

        });

  }

  /** ======================================================================
   * VALIDATE FORM EDIT
  ====================================================================== */
  validateEditForm( campo:string ): boolean{

    if ( this.formUpdate.get(campo)?.invalid && this.formUpdateSubmitted ) {      
      return true;
    }else{
      return false;
    }

  }


  // FIN DE LA CLASE
}
