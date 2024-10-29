import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService, MenuItem } from 'primeng/api';
import { PessoasService } from '../pessoas.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Permissao, Pessoa } from '../../core/model';

@Component({
  selector: 'app-usuarios-permissoes',
  templateUrl: './usuarios-permissoes.component.html',
  styleUrls: ['./usuarios-permissoes.component.css']
})
export class UsuariosPermissoesComponent implements OnInit {

  home: MenuItem;
  breadcrumbItems?: MenuItem[];

  permissoes: Permissao[] = [];

  funcionario: Pessoa = new Pessoa();
  permissoesUsuario: Permissao[] = [];

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private pessoasService: PessoasService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.home = { routerLink: '/home', icon: 'pi pi-home' };
  }

  ngOnInit() {

    const codigoUsuario = this.route.snapshot.params['codigo']

    this.carregarPessoa(codigoUsuario);
    this.carregarListaPermissoesNaoAtribuidas();

    this.breadcrumbItems = [
      { label: 'Cadastros' },
      { label: 'Funcionários', routerLink: '/funcionarios', icon: 'pi pi-external-link' },
      { label: 'Edição de Funcionário' },
      { label: codigoUsuario },
      { label: 'Permissões' }
    ]
      
  }

  carregarPessoa(funcionarioId: number): void {
    this.pessoasService.buscarPorCodigo(funcionarioId)
      .subscribe({
        next: (retorno) => {
          this.funcionario = retorno;
          retorno.permissoes.forEach(p => {
            this.permissoesUsuario.push(p);
          });
          this.atualizarTituloEdicao();
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }
  

  carregarListaPermissoesNaoAtribuidas(): void {
    // Lista de permissões do Sistema
    this.pessoasService.buscarListaPermissoes()
      .subscribe({
        next: (retorno) => {
          retorno.forEach(p => {
            // Adiciona permissões que não estão em permissoesUsuario
            if (!this.permissoesUsuario.some(permissaoUsuario => permissaoUsuario.codigo === p.codigo)) {
              this.permissoes.push(p);
            }
          });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }
  

  salvar(): void {
    this.pessoasService.atualizarListaPermissoes(this.funcionario.funcionarioId!, this.permissoesUsuario)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', detail: 'Salvo com sucesso!' });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }
  

  atualizarTituloEdicao() {
      this.title.setTitle(`SGQ - Gerenciamento de Permissões (ID Usuário: ${this.route.snapshot.params['codigo']})`);
  }

}
