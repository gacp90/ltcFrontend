import { Component, OnInit } from '@angular/core';

// MODELS
import { Product } from 'src/app/models/products.model';
import { User } from '../../models/users.model';

// SERVICES
import { ProductsService } from '../../services/products.service';
import { UsersService } from '../../services/users.service';
import { Corrective } from 'src/app/models/correctives.model';
import { Preventive } from '../../models/preventives.model';
import { PreventivesService } from '../../services/preventives.service';
import { CorrectivesService } from '../../services/correctives.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/task.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public user!: User;

  constructor(  private productsService: ProductsService,
                private usersService: UsersService,
                private preventivesServices: PreventivesService,
                private correctivesService: CorrectivesService,
                private tasksService: TasksService) {  

                  const reloadTask = setInterval( () => {

                    let ruta = window.location.href;
                    let rutaArray = ruta.split('/');
                  
                    if (rutaArray.length > 4 ) {
                      clearInterval(reloadTask);
                    }else if (rutaArray[3] === "dashboard" && rutaArray.length === 4 ){                      
                      this.loadTasks();          
                    }else{
                      clearInterval(reloadTask);
                    }
            
                  }, 60000);

                }

  ngOnInit(): void {

    this.loadProximos();

    this.user = this.usersService.user;
    this.loadPreventives();
    this.loadCorrectives();
    this.loadTasks();

  }

  /* ============================================================================ 
  LOAD TASKS
  ============================================================================ */
  public query: any = {
    desde: 0,
    hasta: 20,
    end: false
  }

  public tasks: Task[] = [];
  public totalTask: number = 0;

  loadTasks(){

    if (this.user.role !== 'ADMIN') {
      this.query.staff = this.user.uid!;
    }
    
    this.tasksService.loadTasks(this.query)
        .subscribe( ({tasks, total}) => {
          this.tasks = tasks;  
          this.totalTask = total;     

        }, (err) => {
          console.log(err);          
        })

  }

  /* ============================================================================ 
  FINALIZAR TASKS
  ============================================================================ */
  finTask(task: Task){

    if (!task.status) {
      task.fechaend = new Date();
      task.status = true;      
    }else{
      task.status = false;
    }


    this.tasksService.updateTask(task, task.taskid!)
        .subscribe( ({task}) => {

          this.loadTasks();
          Swal.fire('Estupendo', 'se ha actualizado la tarea exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /* ============================================================================ 
  CONFIRM TASKS
  ============================================================================ */
  confirmTask(task: Task){

    if (task.end) {
      task.end = false;
    }else{
      task.end = true;
    }


    this.tasksService.updateTask({end: task.end}, task.taskid!)
        .subscribe( ({task}) => {

          this.loadTasks();
          Swal.fire('Estupendo', 'se ha actualizado la tarea exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /* ============================================================================ 
  ELIMINAR TASKS
  ============================================================================ */
  delTask(taskid: string){

    Swal.fire({
      title: 'Estas seguro?',
      text: "De eliminar esta tarea!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.tasksService.deleteTask(taskid)
            .subscribe( ({msg}) => {

              this.loadTasks();
              Swal.fire('Estupendo!', msg, 'success');
           
            })

      }
    })

  }

  /* ============================================================================ 
  FILTRO DE TAREAS PENDIENTES O FINALIZADAS
  ============================================================================ */
  changeEnd(termino: string){

    if (termino === 'pendiente') {
      this.query.end = false;
    }else{
      this.query.end = true;
    }

    this.loadTasks();

  }

  /* ============================================================================ 
  LOAD PROXIMOS
  ============================================================================ */
  cambiarPagina(cant: number){

    this.query.desde += cant;
    this.loadTasks();

  }

  /* ============================================================================ 
  LOAD PROXIMOS
  ============================================================================ */
  public products: Product[] = [];
  public totalProximos: number = 0;
  public inProduct: any;
  loadProximos(){

    let query = `tipo=proximos&status=true&preventivo=false`;
    this.productsService.loadProducts(0, 100, query)
        .subscribe(({ products, total }) =>{

          this.products = products;
          this.totalProximos = total;          

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

  // FIN DE LA CLASE
}
