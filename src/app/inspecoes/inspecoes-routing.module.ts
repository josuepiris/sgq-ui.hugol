import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../seguranca/auth.guard';

import { InspecaoPesquisaComponent } from './inspecao-pesquisa/inspecao-pesquisa.component';
import { InspecaoCadastroComponent } from './inspecao-cadastro/inspecao-cadastro.component';

const routes: Routes = [
  {
    path: '',
    component: InspecaoPesquisaComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ROLE_CONSULTAR_INSPECAO',
        'ROLE_CONSULTAR_SERVICOS_OTIMIZA'
      ]
    }
  },
  {
    path: 'checklist',
    component: InspecaoCadastroComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        'ROLE_CADASTRAR_INSPECAO',
        'ROLE_ALTERAR_INSPECAO'
      ]
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class InspecoesRoutingModule { }
