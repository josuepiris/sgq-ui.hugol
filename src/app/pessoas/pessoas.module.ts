import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PickListModule } from 'primeng/picklist';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';

import { PessoasRoutingModule } from './pessoas-routing.module';

import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasCadastroComponent } from './pessoas-cadastro/pessoas-cadastro.component';
import { UsuariosPermissoesComponent } from './usuarios-permissoes/usuarios-permissoes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    BreadcrumbModule,
    PickListModule,
    InputTextareaModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    PanelModule,
    DropdownModule,
    CheckboxModule,
    FieldsetModule,
    DialogModule,

    PessoasRoutingModule
  ],
  declarations: [
    PessoasPesquisaComponent,
    PessoasCadastroComponent,
    UsuariosPermissoesComponent
  ]

})
export class PessoasModule { }
