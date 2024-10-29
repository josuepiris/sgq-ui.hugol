import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { DepartamentosService } from '../departamentos.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../../seguranca/auth.service';
import { Departamento, FiltroDepartamento } from '../../core/model';
import { DepartamentoCadastroComponent } from '../departamento-cadastro/departamento-cadastro.component';

@Component({
  selector: 'app-departamento-pesquisa',
  templateUrl: './departamento-pesquisa.component.html',
  styleUrl: './departamento-pesquisa.component.css'
})
export class DepartamentoPesquisaComponent {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  filtro = new FiltroDepartamento();

  totalRegistros = 0;
  departamentos: Departamento[] = [];

  dialogRef!: DynamicDialogRef;
  departamento!: Departamento;

  @ViewChild('dt', { static: true }) dt!: Table;

  constructor(
    public auth: AuthService,
    public dialogService: DialogService,
    private title: Title,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private departamentosService: DepartamentosService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.title.setTitle('SGQ - Consulta Departamentos');

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Departamentos' }
    ]

    this.home = { routerLink: '/home', icon: 'pi pi-home' };
  }

  pesquisar(pagina = 0) {
    console.log(this.filtro)
    this.filtro.pagina = pagina;

    if (this.filtro.pagina === 0) {
      this.dt.first = 0;
    }

    this.departamentosService.pesquisar(this.filtro).subscribe({
      next: (retorno) => {
        this.totalRegistros = retorno.total;
        this.departamentos = retorno.departamentos;
      },
      error: (erro) => this.errorHandler.handle(erro),
    });
  }

  aoMudarPagina(event: TableLazyLoadEvent) {
    let pagina;

    if (event.first !== undefined && event.rows != undefined) {
      pagina = event.first / event.rows;
    }

    this.pesquisar(pagina);
  }

  confirmarExclusao(dpto: any) {

    this.confirmationService.confirm({
      key: 'delete',
      message: `
        <span>Confirma a exclusão do registro de Departamento selecionado?</span>
        <hr>
        <table>
          <tr>
            <td><b>Cód.</b></td>
            <td>: ${dpto.codigo}</td>
          </tr>
          <tr>
            <td><b>Desc.</b></td>
            <td>: ${dpto.nome}</td>
          </tr>
        </table>
      `,
      accept: () => {
        this.excluir(dpto);
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', detail: 'Operação cancelada pelo usuário!' });
      }
    });

  }

  excluir(dpto: any) {
    this.departamentosService.excluir(dpto.codigo).subscribe({
      next: () => {

        if (this.dt.first === 0) {
          this.pesquisar();
        } else {
          this.dt.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Departamento excluído com sucesso!' });
      },
      error: (e) => {
        this.errorHandler.handle(e);
      }
    });
  }

  alterarStatus(departamento: any) {
    const novoStatus = !departamento.ativo;

    this.departamentosService.alterarStatus(departamento.codigo, novoStatus)
    .subscribe({
      next: () => {
        departamento.ativo = novoStatus;
        
        const acao = novoStatus ? 'ativado' : 'desativado';
        this.messageService.add({ severity: 'success', detail: `Departamento ${acao} com sucesso!` });
      },
      error: (e) => {
        this.errorHandler.handle(e);
      }
    });
  }

  cadastrarDepartamento() {
    this.departamento = new Departamento();

    // TODO: Definir o valor padrão diretamente no banco de dados
    this.departamento.ativo = true;
    this.abrirFormularioCadastro();
  }

  carregarDepartamento(codigo: number) {
    this.departamentosService.buscarPorCodigo(codigo)
      .subscribe({
        next: (retorno) => {
          this.departamento = retorno;
          this.abrirFormularioCadastro();
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

  abrirFormularioCadastro() {
    this.dialogRef = this.dialogService.open(DepartamentoCadastroComponent, {
      header: 'Cadastro de Departamento',
      modal: true,
      maximizable: true,
      resizable: false,
      width:'70vw',
      height: 'auto',
      appendTo: 'body',
      data: this.departamento
    });
  }

}
