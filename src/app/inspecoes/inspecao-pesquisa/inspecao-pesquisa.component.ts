import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MenuItem, SelectItem } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

import { FiltroInspecao } from '../../core/model';
import { AuthService } from '../../seguranca/auth.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { InspecoesService } from '../inspecoes.service';

@Component({
  selector: 'app-inspecao-pesquisa',
  templateUrl: './inspecao-pesquisa.component.html',
  styleUrl: './inspecao-pesquisa.component.css'
})
export class InspecaoPesquisaComponent {

  home!: MenuItem;
  breadcrumbItems!: MenuItem[];

  inspecoes!: any[];
  statusInspecoes: SelectItem[];

  totalRegistrosInspecoes = 0;

  filtro!: FiltroInspecao;
  inspecoesDataHoraAtualizacaoLista!: Date;

  pCalendarMaxDate = new Date();

  @ViewChild('dtInspecoes', { static: true }) dtInspecoes!: Table;

  constructor(
    public auth: AuthService,
    //public progressBarService: ProgressBarService,
    private title: Title,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private inspecoesService: InspecoesService
  ) {

    this.filtro = new FiltroInspecao();

    this.statusInspecoes = [
      { label: 'Em andamento', value: 0, disabled: false },
      { label: 'À conferir', value: 1, disabled: false },
      { label: 'Finalizada', value: 2, disabled: false }
    ]

  }

  ngOnInit() {

    this.title.setTitle('SGQ - Consulta Inspeções');

    this.breadcrumbItems = [
      { label: 'Inspeções' }, { label: 'Consulta Inspeções' }
    ]

    this.home = { routerLink: '/dashboards', icon: 'pi pi-home' };

    this.onChangeStatus();

  }

  buscarInspecoes(pagina = 0) {
    this.filtro.pagina = pagina;

    if (this.filtro.pagina === 0) {
      this.dtInspecoes.first = 0;
    }

    this.inspecoesService.buscarInspecoes(this.filtro)
      .subscribe({
        next: (r) => {
          this.inspecoesDataHoraAtualizacaoLista = new Date();
          this.inspecoes = r.inspecoes;
          this.totalRegistrosInspecoes = r.total;
        },
        error: () => {
          this.errorHandler.handle(
            'Não foi possível recuperar a lista de Inspeções. Por favor, tente novamente!'
          );
        }
      });
  }

  atualizar() {
    this.buscarInspecoes();
    this.filtro.salvarFiltro();
  }

  onChangeStatus() {

    const filtro = this.filtro.statusInspecoes;
    const status = this.statusInspecoes;  
  
    if (filtro.length === 1) {
      // Se houver apenas um item selecionado, desabilita-o
      status.forEach(i => {
        i.disabled = filtro.includes(i.value);
      });
    } else {
      // Se houver mais de um selecionado, habilita todos os itens
      status.forEach(i => i.disabled = false);
    }
  
  }

  getTagStatusInspecao(status: number): {
    severity: any
    icon: string,
    statusString: string,
  } {

    let severity;
    let icon;
    let statusString;

    switch (status) {
      case 0:
        severity = 'info';
        icon = 'pi pi-play-circle';
        statusString = 'EM ANDAMENTO';
        break;
      case 1:
        severity = 'info';
        icon = 'pi pi-user';
        statusString = 'À CONFERIR';
        break;
      case 2:
        severity = 'success';
        icon = 'pi pi-check-circle';
        statusString = 'FINALIZADA';
        break;
      default:
        severity = '';
        icon = '';
        statusString = '';
        break;
    }

    return { severity, icon, statusString,  };

  }

  getTagResultadoInspecao(resultado: string): {
    severity: any
    icon: string,
    statusString: string,
  } {

    let severity;
    let icon;
    let statusString;

    switch (resultado) {
      case 'A':
        severity = 'success';
        icon = 'pi pi-thumbs-up-fill';
        statusString = 'APROVADA';
        break;
      case 'R':
        severity = 'danger';
        icon = 'pi pi-thumbs-down-fill';
        statusString = 'REPROVADA';
        break;
      default:
        severity = '';
        icon = '';
        statusString = '';
        break;
    }

    return { severity, icon, statusString,  };

  }

  getEstiloCancelado(propriedade: number): string {
    return propriedade === 3 ? 'line-through' : 'none';
  }

  aoSelecionarInspecao(event: any) {

    const inspecao = event.data;

    if (inspecao.idChecklist) {
      this.router.navigate(['/inspecoes/checklist'], {
        queryParams: {
          id: inspecao.idChecklist,
          otimizaNumeroOS: inspecao.otimizaNumeroOs
        }
      });
    } else {
      this.errorHandler.handle(
        'Não existe mapeamento do Checklist p/ o registro selecionado!', 5000
      );
    }
  }

  aoMudarPagina(event: TableLazyLoadEvent) {
    let pagina;

    if (event.first !== undefined && event.rows != undefined) {
      pagina = event.first / event.rows;
    }
    
    this.buscarInspecoes(pagina);
  
  }

}
