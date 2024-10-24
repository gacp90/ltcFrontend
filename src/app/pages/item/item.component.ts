import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from 'src/app/models/inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private productsService: InventoryService,
                private router: Router,
                private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loadProduct();

  }

  /** ================================================================
   *  LOAD PRODUCT ID
  ==================================================================== */
  public product: Inventory | any;
  public portada: string = 'none';

  loadProduct(){

    this.activatedRoute.params
        .subscribe( ({id}) =>  {      
        

          this.productsService.loadProductId(id)
              .subscribe( ({product}) => {                

                this.product = product;

                this.updateForm.setValue({
                  sku: this.product.sku,
                  name: this.product.name,
                  type: this.product.type,
                  description: this.product.description,
                  price: this.product.price,
                  cost: this.product.cost,
                  min: this.product.min,
                  visibility: this.product.visibility
                })
                

              }, (err) => {
                Swal.fire('Error', err.error.msg, 'error');
                this.router.navigateByUrl('/');
                
              });

      });

  }

  /** ================================================================
   *  UPDATE PRODUCT
  ==================================================================== */
  public formSubmitted: boolean = false;
  public updateForm = this.fb.group({
    sku: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: 'Unidad',
    description: '',
    price: 0,
    cost: 0,
    min: 0,
    visibility: true,
  })

  update(){

    this.formSubmitted = true;
    
    if (this.updateForm.invalid) {      
      this.formSubmitted = false;
      return;
    }

    this.productsService.updateProduct( this.updateForm.value, this.product.inid! )
        .subscribe( ({product}) => {

          this.product = product;
          Swal.fire('Estupendo', 'El producto se ha actualizado exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })


  }

  /** ================================================================
   *  VALIDATE FORM
  ==================================================================== */
  validate(campo: string): boolean{

    if (this.updateForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }else{
      return false;
    }
  }

  /** ================================================================
   *  UPDATE INVENTORY PRODUCT
  ==================================================================== */
  public upInventorySubmmited: boolean = false;
  public upInventoryForm = this.fb.group({
    qty: [0, [Validators.required, Validators.min(0)]],
    sku: '',
    movimiento: 'Agregados'
  })
  
  updateInventory(){
    
    this.upInventorySubmmited = true;

    if (this.upInventoryForm.invalid || this.upInventoryForm.value.qty <= 0) {
      return;
    }

    this.upInventoryForm.value.sku = this.product.sku;  

    this.productsService.updateProduct(this.upInventoryForm.value, this.product.inid)
        .subscribe( ({product}) => {

          this.product = product;

          this.upInventorySubmmited = false;
          this.upInventoryForm.reset({
            movimiento: 'Agregados'
          });
          Swal.fire('Estupendo', 'Se ha actualizado el inventario exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ================================================================
   *  VALIDATE UPDATE INVENTORY FORM
  ==================================================================== */
  validateUpInv(campo: string): boolean{

    if (this.upInventoryForm.get(campo)?.invalid && this.upInventorySubmmited ) {
      return true;
    }else{
      return false;
    }
  }

  /** ================================================================
   *  CHANGE STATUS
  ==================================================================== */
  changeStatus(status: boolean){

    if (status) {
      status = false;
    }else{
      status = true;      
    }

    this.productsService.updateProduct({sku: this.product.sku, status}, this.product.inid!)
        .subscribe( ({product}) => {

          this.product.status = product.status;
          Swal.fire('Estupendo', ' Se ha actualizdo el estado del producto exitosamente!', 'success');

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');
        })

  }

}
