import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { DepartamentosRoutingModule } from './departamentos-routing.module';
import { DepartamentoPesquisaComponent } from './departamento-pesquisa/departamento-pesquisa.component';
import { DepartamentoCadastroComponent } from './departamento-cadastro/departamento-cadastro.component';


@NgModule({
  declarations: [
    DepartamentoPesquisaComponent,
    DepartamentoCadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    BreadcrumbModule,
    PanelModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    InputNumberModule,

    DepartamentosRoutingModule
  ]
})
export class DepartamentosModule { }
