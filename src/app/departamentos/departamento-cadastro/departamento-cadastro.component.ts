import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Departamento } from '../../core/model';
import { AuthService } from '../../seguranca/auth.service';
import { DepartamentosService } from '../departamentos.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-departamento-cadastro',
  templateUrl: './departamento-cadastro.component.html',
  styleUrl: './departamento-cadastro.component.css'
})
export class DepartamentoCadastroComponent {

  departamento!: Departamento;

  @ViewChild('f', { static: false }) f!: NgForm;

  constructor(
    public auth: AuthService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private messageService: MessageService,
    private departamentosService: DepartamentosService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.departamento = this.dialogConfig.data;
  }

  salvar() {
    if (this.departamento.codigo) {
      this.atualizarDepartamento();
    } else {
      this.adicionarDepartamento();
    }
  }

  adicionarDepartamento() {
    this.departamentosService.adicionar(this.departamento)
      .subscribe({
        next: (dpto) => {
          this.departamento = dpto;
          this.f.form.markAsPristine();
          this.messageService.add({
            severity: 'success', detail: 'Registro criado com sucesso!'
          });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

  atualizarDepartamento() {
    this.departamentosService.atualizar(this.departamento)
      .subscribe({
        next: (dpto) => {
          this.departamento = dpto;
          this.f.form.markAsPristine();
          this.messageService.add({
            severity: 'success', detail: 'Registro atualizado com sucesso!'
          });
        },
        error: (erro) => this.errorHandler.handle(erro)
      });
  }

}
