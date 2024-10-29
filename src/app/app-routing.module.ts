import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'departamentos', loadChildren: () => import('../app/departamentos/departamentos.module').then(m => m.DepartamentosModule) },
  { path: 'inspecoes', loadChildren: () => import('../app/inspecoes/inspecoes.module').then(m => m.InspecoesModule) },
  { path: 'funcionarios', loadChildren: () => import('../app/pessoas/pessoas.module').then(m => m.PessoasModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
