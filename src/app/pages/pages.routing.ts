import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// GUARDS
import { AuthGuard } from '../guards/auth.guard';

// COMPONENTS
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientesComponent } from './clientes/clientes.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { PagesComponent } from './pages.component';
import { CorrectivosComponent } from './correctivos/correctivos.component';
import { PreventivosComponent } from './preventivos/preventivos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PreventivoComponent } from './preventivo/preventivo.component';
import { CorrectivoComponent } from './correctivo/correctivo.component';
import { ProductoComponent } from './producto/producto.component';
import { AbonadosComponent } from './abonados/abonados.component';
import { AbonadoComponent } from './abonado/abonado.component';
import { PrefixesComponent } from './prefixes/prefixes.component';
import { AdminGuard } from '../guards/admin.guard';
import { ItemComponent } from './item/item.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { InventoryComponent } from './inventory/inventory.component';
import { FacturarComponent } from './facturar/facturar.component';
import { FacturasComponent } from './facturas/facturas.component';
import { FacturaComponent } from './factura/factura.component';


// COMPONENTS

const routes: Routes = [
    
    { 
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children:
        [
          { path: '', component: DashboardComponent, data:{ title: 'Dashboard' } },
          { path: 'abonado/:id', component: AbonadoComponent, canActivate: [AdminGuard], data:{ title: 'Abonado' } },
          { path: 'abonados', component: AbonadosComponent, canActivate: [AdminGuard], data:{ title: 'Abonados' } },
          { path: 'clientes', component: ClientesComponent, canActivate: [AdminGuard], data:{ title: 'Clientes' } },
          { path: 'correctivos', component: CorrectivosComponent, canActivate: [AdminGuard], data:{ title: 'Correctivos' } },
          { path: 'correctivo/:id', component: CorrectivoComponent, data:{ title: 'Correctivo' } },
          { path: 'facturar', component: FacturarComponent, canActivate: [AdminGuard], data:{ title: 'Facturación' } },
          { path: 'facturas', component: FacturasComponent, canActivate: [AdminGuard], data:{ title: 'Facturas' } },
          { path: 'factura/:id', component: FacturaComponent, canActivate: [AdminGuard], data:{ title: 'Factura' } },
          { path: 'prefixes', component: PrefixesComponent, canActivate: [AdminGuard], data:{ title: 'Prefijos' } },
          { path: 'preventivos', component: PreventivosComponent, canActivate: [AdminGuard], data:{ title: 'Preventivos' } },
          { path: 'preventivo/:id', component: PreventivoComponent, data:{ title: 'Preventivo' } },
          { path: 'productos', component: ProductosComponent, canActivate: [AdminGuard], data:{ title: 'Productos' } },
          { path: 'inventario', component: InventoryComponent, canActivate: [AdminGuard], data:{ title: 'Inventario' } },
          { path: 'item/:id', component: ItemComponent, canActivate: [AdminGuard], data:{ title: 'Item' } },
          { path: 'movimientos', component: MovimientosComponent, canActivate: [AdminGuard], data:{ title: 'Movimientos' } },
          { path: 'producto/:id', component: ProductoComponent, canActivate: [AdminGuard], data:{ title: 'Producto' } },
          { path: 'perfil/:id', component: PerfilComponent, data:{ title: 'Perfil' } },
          { path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard], data:{ title: 'Usuarios' } },
          { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
        ] 
      },    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
