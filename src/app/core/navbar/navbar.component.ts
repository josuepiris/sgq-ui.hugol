import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';

import { AuthService } from '../../seguranca/auth.service';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  items: MenuItem[];

  constructor(
    public auth: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {
    this.items = [
      {
        label: 'Dashboards',
        icon: 'pi pi-chart-line',
        routerLink: '/dashboards/acompanhamento-servicos'
      },
      {
        separator: true
      },
      {
        label: 'Cadastros',
        icon: 'pi pi-plus',
        visible: this.auth.temQualquerPermissao([
          'ROLE_CONSULTAR_FUNCIONARIO', 'ROLE_CONSULTAR_DEPARTAMENTO',
        ]),
        items: [
          {
            label: 'Funcionários',
            icon: 'pi pi-users',
            routerLink: '/funcionarios',
            visible: this.auth.temPermissao('ROLE_CONSULTAR_FUNCIONARIO')
          },
          {
            label: 'Departamentos',
            icon: 'pi pi-sitemap',
            routerLink: '/departamentos',
            visible: this.auth.temPermissao('ROLE_CONSULTAR_DEPARTAMENTO')
          }
        ]
      },
      {
        label: 'Inspeções',
        icon: 'pi pi-check',
        routerLink: '/inspecoes',
        visible: this.auth.temQualquerPermissao([
          'ROLE_CONSULTAR_SERVICOS_OTIMIZA', 'ROLE_CONSULTAR_INSPECAO', 'ROLE_CADASTRAR_INSPECAO'
        ])
      }
    ]
  }

  logout() {
    this.auth.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(e => this.errorHandler.handle(e));
  }

}
