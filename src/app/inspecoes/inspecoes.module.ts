import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ContextMenuModule } from 'primeng/contextmenu';

import { InspecoesRoutingModule } from './inspecoes-routing.module';
import { InspecaoPesquisaComponent } from './inspecao-pesquisa/inspecao-pesquisa.component';
import { InspecaoCadastroComponent } from './inspecao-cadastro/inspecao-cadastro.component';

@NgModule({
  declarations: [
    InspecaoPesquisaComponent,
    InspecaoCadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    BreadcrumbModule,
    PanelModule,
    CalendarModule,
    RadioButtonModule,
    MultiSelectModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TooltipModule,
    TagModule,
    DropdownModule,
    AutoCompleteModule,
    TabViewModule,
    CheckboxModule,
    AccordionModule,
    InputNumberModule,
    DividerModule,
    ContextMenuModule,
    //ButtonModule,
    //InputTextareaModule,
    //DialogModule,
    //DynamicDialogModule,

    InspecoesRoutingModule
  ]
})
export class InspecoesModule { }
