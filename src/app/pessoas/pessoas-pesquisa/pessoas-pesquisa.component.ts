import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';

import { PessoasService } from '../pessoas.service';
import { DepartamentosService } from '../../departamentos/departamentos.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { DropdownItem, PessoaFiltro } from '../../core/model';
import { Table, TableLazyLoadEvent } from 'primeng/table';


@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})

export class PessoasPesquisaComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems: MenuItem[];

  filtro = new PessoaFiltro();
  dropdownDepartamentos: DropdownItem[]= [];
  
  pessoas = [];
  totalRegistros = 0;

  @ViewChild('tabela', { static: true }) dt!:Table;

  constructor(
    private title: Title,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pessoasService: PessoasService,
    private departamentosService: DepartamentosService,
    private errorHandler: ErrorHandlerService, 
  ) { 
    
    this.title.setTitle('SGQ - Consulta de Funcionários');

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Funcionários' }
    ]

    this.home = { routerLink: '/home', icon: 'pi pi-home' };
  }

  ngOnInit(): void {
    this.carregarDepartamentos();
  }

  pesquisar(pagina = 0): void {
    this.filtro.pagina = pagina;
  
    if (this.filtro.pagina === 0) {
      this.dt.first = 0;
    }
  
    this.pessoasService.pesquisar(this.filtro)
      .subscribe({
        next: (resultado) => {
          this.totalRegistros = resultado.total;
          this.pessoas = resultado.pessoas;
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }
  

  aoMudarPagina(event: TableLazyLoadEvent) {
    let pagina;

    if (event.first !== undefined && event.rows != undefined) {
      pagina = event.first / event.rows;
    }

    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {

    this.confirmationService.confirm({
      key: 'delete',
      message: `
        <span>Confirma a exclusão do registro de Departamento selecionado?</span>
        <hr>
        <table>
          <tr>
            <td><b>Cód.</b></td>
            <td>: ${pessoa.funcionarioId}</td>
          </tr>
          <tr>
            <td><b>Desc.</b></td>
            <td>: ${pessoa.nome}</td>
          </tr>
        </table>
      `,
      accept: () => {
        this.excluir(pessoa);
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', detail: 'Operação cancelada pelo usuário!' });
      }
    });

  }

  carregarDepartamentos() {
    this.departamentosService.listarTodos()
      .subscribe({
        next: (r) => {
          r = r.filter(dpto => dpto.ativo);
          this.dropdownDepartamentos = r.map(dpto => ({ label: dpto.nome, value: dpto.codigo }));
        },
        error: (e) => this.errorHandler.handle(e)
      });
  }

  excluir(pessoa: any) {
    this.pessoasService.excluir(pessoa.funcionarioId)
      .subscribe({
        next: () => {
          if (this.dt.first === 0) {
            this.pesquisar();
          } else {
            this.dt.first = 0;
          }
  
          this.messageService.add({ severity: 'success', detail: 'Funcionário excluído com sucesso!' });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;
  
    this.pessoasService.mudarStatus(pessoa.funcionarioId, novoStatus)
      .subscribe({
        next: () => {
          const acao = novoStatus ? 'ativado' : 'desativado';
          
          pessoa.ativo = novoStatus;
          console.log(`Funcionário ${acao} com sucesso!`)
          this.messageService.add({ severity: 'success', detail: `Funcionário ${acao} com sucesso!` });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }
  

}
