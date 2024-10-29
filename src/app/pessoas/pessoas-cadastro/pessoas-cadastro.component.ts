import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';
import { DropdownItem, Pessoa } from '../../core/model';
import { PessoasService } from '../pessoas.service';
import { DepartamentosService } from '../../departamentos/departamentos.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems?: MenuItem[];

  funcionario = new Pessoa(); // Usamos o objeto funcionario diretamente
  dropdownDepartamentos: DropdownItem[] = [];
  loginAtivo = false;
  confirmacaoSenha?: string;

  constructor(
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private pessoasService: PessoasService,
    private departamentosService: DepartamentosService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) { 
    this.home = { routerLink: '/home', icon: 'pi pi-home' };
  }

  ngOnInit() {
    this.title.setTitle('SGQ - Cadastro de Funcionário');
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.carregarDepartamentos();

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Funcionários', routerLink: '/funcionarios', icon: 'pi pi-external-link' },
      { label: !this.editando ? 'Novo Funcionário' : 'Edição de Funcionário' }
    ];

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
      this.breadcrumbItems.push({ label: codigoPessoa });
    }
  }

  get editando() {
    return Boolean(this.route.snapshot.params['codigo']);
  }

  carregarPessoa(funcionarioId: number): void {
    this.pessoasService.buscarPorCodigo(funcionarioId)
      .subscribe({
        next: (retorno) => {
          this.funcionario = retorno;
          if (this.funcionario.userId) {
            this.loginAtivo = true;
            this.funcionario.senha = ''; 
          }
          this.atualizarTituloEdicao();
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

  salvar() {
    if (this.funcionario.userId) {
      if (!this.loginAtivo && !this.funcionario.senha) {
        this.errorHandler.handle('Por favor, informe a Senha!'); return;
      }
      if (this.funcionario.senha) {
        if (!this.confirmacaoSenha) {
          this.errorHandler.handle('Por favor, confirme a Senha!'); return;
        } else if (this.confirmacaoSenha !== this.funcionario.senha) {
          this.errorHandler.handle('As senhas digitadas não correspondem!'); return;
        }
      }
    } else {
      this.funcionario.userId = '';
      this.funcionario.senha = '';
    }

    if (this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }
  }

  adicionarPessoa(): void {
    this.pessoasService.adicionar(this.funcionario)
      .subscribe({
        next: (funcionarioAdicionado) => {
          this.messageService.add({ severity: 'success', detail: 'Registro adicionado com sucesso!' });
          this.router.navigate(['/funcionarios', funcionarioAdicionado.funcionarioId]);
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

  atualizarPessoa() {
    this.pessoasService.atualizar(this.funcionario)
      .subscribe({
        next: (r) => {
          this.messageService.add({ severity: 'success', detail: 'Registro alterado com sucesso!' });
          this.funcionario.senha = '';
          this.confirmacaoSenha = '';
          this.loginAtivo = Boolean(this.funcionario.userId);
          this.atualizarTituloEdicao();
        },
        error: (e) => this.errorHandler.handle(e)
      });
  }

  nova() {
    if (!this.editando) {
      this.funcionario = new Pessoa(); 
      this.confirmacaoSenha = '';
    } else {
      this.router.navigate(['/funcionarios/novo']);
    }
  }

  carregarDepartamentos() {
    this.departamentosService.listarTodos()
      .subscribe({
        next: (r) => {
          if (!this.editando) {
            r = r.filter(dpto => dpto.ativo);
          }
          this.dropdownDepartamentos = r.map(dpto => ({ label: dpto.nome, value: dpto.codigo }));
        },
        error: (e) => this.errorHandler.handle(e)
      });
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`SGQ - Edição de Funcionário: ${this.route.snapshot.params['codigo']}`);
  }

  irParaGenrenciamentoPermissoes() {
    const path = '/funcionarios/' + this.funcionario.funcionarioId + '/permissoes'
    this.router.navigate([path]);
  }
}
