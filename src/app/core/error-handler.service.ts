import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';

import { NotAuthenticatedError } from '../seguranca/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private router: Router,
    private messageService: MessageService
  ) { }

  handle(e: any, life?: number) {

    let msg: string;

    if (typeof e === 'string') {
      msg = e;
    } else if (e instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);
    } else if (e instanceof HttpErrorResponse && e.status >= 400 && e.status <= 499) {

      msg = 'Não foi possível processar sua solicitação! Requisição inválida.';

      if (e.status === 403) {
        msg = 'Você não tem permissão para executar esta ação!';
      }

      try {
        msg = e.error[0].mensagemUsuario;
      } catch (e) { }

      console.error('Ocorreu um erro', e);

    } else {
      msg = 'Não foi possível processar sua solicitação! Erro no servidor.';
    }

    this.messageService.add({ life: life ?? 5000, severity: 'error', detail: msg });

  }

}
