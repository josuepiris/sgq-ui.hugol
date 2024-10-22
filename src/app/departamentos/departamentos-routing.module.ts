import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartamentoPesquisaComponent } from './departamento-pesquisa/departamento-pesquisa.component';

import { AuthGuard } from '../seguranca/auth.guard';
import { DepartamentoCadastroComponent } from './departamento-cadastro/departamento-cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: DepartamentoPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CONSULTAR_DEPARTAMENTO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
