import { Component, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MessageService } from 'primeng/api';

import { AuthService } from '../auth.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private title: Title,
    private router: Router,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService
  ) {
    this.title.setTitle('SETECH - Login');
  }

  login(usuario: string, senha: string) {
    this.authService.login(usuario, senha)
      .then(() => {
        this.router.navigate(['/departamentos']);
      })
      .catch(e => {
        if (typeof e === 'string') {
          this.messageService.add({ key: 'msg-login', severity: 'error', detail: e, life: 12000 });
        } else {
          this.errorHandler.handle(e);
        }
      });
  }

}
