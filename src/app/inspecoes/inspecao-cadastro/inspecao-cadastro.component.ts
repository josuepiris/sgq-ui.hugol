import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MenuItem, SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

import { Observable, firstValueFrom } from 'rxjs';

import { ErrorHandlerService } from '../../core/error-handler.service';
import { Inspecao, Checklist, Pessoa, DropdownItem } from '../../core/model';
import { AuthService } from '../../seguranca/auth.service';
import { InspecoesService } from '../inspecoes.service';

@Component({
  selector: 'app-inspecao-cadastro',
  templateUrl: './inspecao-cadastro.component.html',
  styleUrl: './inspecao-cadastro.component.css'
})
export class InspecaoCadastroComponent {

  checklistId: string | null = null;
  otimizaNumeroOS: string | null = null;

  home!: MenuItem;
  breadcrumbItems!: MenuItem[];

  // Speed Dial Itens
  sdItens: MenuItem[] | undefined;

  inspecao: Inspecao = new Inspecao();

  checklistOptions = [
    { label: 'A', value: 'A' },
    { label: 'R', value: 'R' },
    { label: 'N/A', value: 'N' }
  ]

  @ViewChild('f', { static: false }) f!: NgForm;

  //variáveis do componente de seleção do checklist
  dropdownChecklist!: DropdownItem[];
  checklistSelecionado!: number;
  isChecklistSelecionado!: boolean;
  isDisplayDialogChecklist!: boolean;

  dropdownSugestoesObservacoes: DropdownItem[] = [];
  sugestaoObservacoesSelecionada: number | null = null;

  inspecaoConferida!: boolean;

  detalhesInspecaoIcone!: string;
  detalhesInspecaoAltImg!: string;
  detalhesInspecaoSumario!: string;
  detalhesInspecaoMensagem!: string;

  dialogRef!: DynamicDialogRef;

  allSubitemsValue!: string;

  constructor(
    public auth: AuthService,
    //public progressBarService: ProgressBarService,
    public dialogService: DialogService,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private inspecoesService: InspecoesService
  ) { }

  ngOnInit(): void {

    this.title.setTitle('SGQ - Registro de Inspeção');

    this.breadcrumbItems = [
      { label: 'Inspeções', routerLink: '/inspecoes' }
    ]

    this.home = { routerLink: '/dashboards', icon: 'pi pi-home' };

    // Capturando os parâmetros da query string
    this.activatedRoute.queryParamMap.subscribe(params => {
      const checklistId = params.get('id');
      const otimizaNumeroOS = params.get('otimizaNumeroOS');

      if (!checklistId) {
        this.buscarSumarioChecklists();
      }
    });

    this.buscarSugestoesObservacoes();

  }

  buscarSumarioChecklists() {
    this.inspecoesService.buscarSumarioChecklists()
      .subscribe({
        next: checklists => {
          this.dropdownChecklist = checklists
            .map(checklist => ({ label: checklist.descricao, value: checklist.id }));
          this.isDisplayDialogChecklist = true;
        },
        error: erro => this.errorHandler.handle(erro)
      });
  }

  buscarChecklist(id: number): Promise<void> {
    let buscaChecklist$: Observable<Checklist>;
    
    buscaChecklist$ = this.inspecoesService.buscarChecklist(id);

    // Converte o Observable em Promise usando firstValueFrom()
    return firstValueFrom(buscaChecklist$)
      .then(checklist => {
        this.inspecao.checklist = checklist;
        this.breadcrumbItems.push({ label: this.inspecao.checklist.descricao });
      })
      .catch(erro => {
        if (erro.status === 404) {
          this.messageService.add({
            severity: 'error',
            detail: 'Checklist "' + id + '" não encontrado!'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            detail: 'Não foi possível carregar os dados do Checklist! Por favor, tente novamente.'
          });
        }
      });
  }

  buscarInspecao(checklistId: number) {
    console.log('buscando registro de inspeção...')
    this.inspecoesService.buscarInspecao(checklistId).subscribe({
      next: inspecao => {
        Object.assign(this.inspecao, inspecao);     
        this.setDetalhesInspecao();

        this.breadcrumbItems.push({ label: this.inspecao.checklist.descricao });
      },
      error: erro => {
        if (erro.status === 404) {          
          
          this.buscarChecklist(checklistId);
          this.setDetalhesInspecao();

        } else {
          this.messageService.add({
            severity: 'error',
            detail: 'Não foi possível carregar o registro de Inspeção! Por favor, tente novamente.'
          });
        }
      }
    });
  }

  buscarSugestoesObservacoes() {
    this.inspecoesService.buscarSugestoesObservacoes().subscribe({
      next: sugestoes => {
        this.dropdownSugestoesObservacoes = sugestoes.map(s => ({
          label: s.descricao, value: s.id
        }));
      },
      error: erro => this.errorHandler.handle(erro)
    });
  }

  limparObservacoes() {
    this.f.form.markAsDirty();
    this.inspecao.observacoes = null;
  }

  setAllSubitems(itemId: number, value: any): void {
    const item = this.inspecao.checklist.itens.find(i => i.id === itemId);

    if (item) {
      item.subitens.forEach(subitem => {
        subitem.valorSubitem = value;

        // Se o valor for 'N', limpar o complementoSubitem
        if (value === 'N') {
          subitem.complementoSubitem = null;
        }
      });
    }
  }

  incluirSugestaoObservacoes() {

    const sugestaoObservacoes = this.dropdownSugestoesObservacoes.find(
      o => o.value === this.sugestaoObservacoesSelecionada
    )!.label

    if (this.inspecao.observacoes) {
      this.inspecao.observacoes = this.inspecao.observacoes + '\r' + sugestaoObservacoes;
    } else {
      this.inspecao.observacoes = sugestaoObservacoes;
    }

    this.sugestaoObservacoesSelecionada = null;

    this.f.form.markAsDirty();

  }

  confirmarAcaoInspecao() {
      const mensagem = !this.inspecao.id ? 'Iniciar a Inspeção?' : 'Finalizar a Inspeção?';
      this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: mensagem, detail: 'Confirme para prosseguir' });
  }

  aoConfirmarOuRejeitarAcaoInspecao(confirmado: boolean) {
    this.messageService.clear('c');
    confirmado ? this.salvarInspecao() : this.messageService.add({ severity: 'warn', detail: 'Operação cancelada!' });
  }

  salvarInspecao() {

    if (!this.inspecao.id) {
      this.inspecao.inspetor = new Pessoa(this.auth.jwtPayload.uid);

      this.inspecoesService.criarInspecao(this.inspecao)
        .subscribe({
          next: (inspecao) => {
            this.messageService.add({ severity: 'success', detail: 'Registro criado com sucesso!' });
            this.inspecao = inspecao;
            this.setDetalhesInspecao();
          },
          error: () => (
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível criar o registro de Inspeção! Por favor, tente novamente.'
            })
          )
        });

    } else {

      this.inspecoesService.atualizarInspecao(this.inspecao)
        .subscribe({
          next: (inspecao) => {
            this.messageService.add({ severity: 'success', detail: 'Registro atualizado com sucesso!' });
            this.inspecao = inspecao;
            this.setDetalhesInspecao();
            this.f.form.markAsPristine();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível atualizar o registro de Inspeção! Por favor, tente novamente.'
            });
          }
        });
    }
  }

  definirConferente() {
    this.confirmationService.confirm({
      header: 'CONFIRMAR CONFERÊNCIA',
      message: 'Confirma o registro de conferência da Inspeção?!',
      accept: () => {
        this.inspecoesService.definirConferente(this.inspecao.id, this.auth.jwtPayload.uid)
          .subscribe({
            next: (inspecao) => {
              this.messageService.add({ severity: 'success', detail: 'Registro atualizado com sucesso!' });
              this.inspecao = inspecao;
              this.setDetalhesInspecao();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                detail: 'Não foi possível atualizar o registro de Inspeção! Por favor, tente novamente.'
              })
            }
          });

      },
      reject: () => {
        this.messageService.add({ severity: 'warn', detail: 'Operação cancelada pelo usuário!' });
      }
    });
  }

  markFormAsDirty() {
    this.f.form.markAsDirty();
  }

  setDetalhesInspecao() {
    const status = this.inspecao.status;

    switch (status) {
      case 0:
        this.detalhesInspecaoSumario = 'Inspeção em andamento';
        this.detalhesInspecaoIcone = '/warn.png';
        this.detalhesInspecaoMensagem = 'Não é permitido alterar o registro enquanto a inspeção estiver em andamento.';
        break;
      case 1:
        this.detalhesInspecaoSumario = 'Inspeção concluída (não conferida)';
        this.detalhesInspecaoIcone = '/done.png';
        this.detalhesInspecaoMensagem = 'A inspeção foi concluída, mas ainda não foi conferida pelo R.T.';
        break;
      case 2:
        this.detalhesInspecaoSumario = 'Inspeção finalizada';
        this.detalhesInspecaoIcone = '/done.png';
        this.detalhesInspecaoMensagem = 'A inspeção foi concluída e conferida pelo R.T.';
        break;
      default:
        this.detalhesInspecaoSumario = 'Inspeção não iniciada';
        this.detalhesInspecaoIcone = '/clock.png';
        this.detalhesInspecaoMensagem = 'Clique no botão abaixo para iniciar a inspeção.';
        break;
    }
  }

  getContainerClass() {
    return {
      'insp-nao-iniciada': !this.inspecao.status,
      'insp-em-andamento': this.inspecao.status === 0,
      'insp-concluida': this.inspecao.status === 1 || this.inspecao.status === 2
    };
  }

  getSummaryStyle() {
    if (this.inspecao.status === 0) {
      return { 'color': '#d32f2f' };
    } else if (this.inspecao.status === 1 || this.inspecao.status === 2) {
      return { 'color': '#0e6251' };
    } else {
      return {};
    }
  }

  exibirHistoricoAlteracoes() {
    /*this.dialogRef = this.dialogService.open(InspecoesAlteracoesHistoricoComponent, {
        data: this.inspecao.historicoAlteracoes,
        header: 'Histórico de alterações',
        width: '50%'
    });*/
  }

  //funções do componente de seleção do checklist
  async aoSelecionarChecklist() {
    this.isChecklistSelecionado = true;
    this.isDisplayDialogChecklist = false;

    try {
      // Chama o método e aguarda o retorno da Promise
      await this.buscarChecklist(this.checklistSelecionado);
    } catch (e) {
      console.error(e);
    }
  }

  onHideDialogChecklist() {
    if (!this.isChecklistSelecionado) {
      this.router.navigate(['/inspecoes']);
    }
  }

}
