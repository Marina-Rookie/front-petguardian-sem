import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformesComponent } from './pages/informe-cuidadores/informe-cuidadores.component';
import { InformesClientesComponent } from './pages/informe-clientes/informe-clientes.component';

const routes: Routes = [
  // ...existing routes...
  { path: 'informe-cuidadores', component: InformesComponent },
  { path: 'informe-clientes', component: InformesClientesComponent },
  // ...existing routes...
  { path: '**', redirectTo: '/login' } // Ensure a wildcard route to handle undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
