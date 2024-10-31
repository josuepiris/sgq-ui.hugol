export class Departamento {
  codigo!: number;
  ativo!: boolean;
  nome!: string;
}

export class Permissao {
  codigo!: number;
  roleName!: string;
  descricao!: string;
}

export class Pessoa {
  funcionarioId?: number;
  ativo!: boolean;
  nome!: string;
  departamento!: Departamento;
  userId!: string;
  senha!: string;
  permissoes!: Permissao[];
  assinatura!: string;

  constructor(funcionarioId?: number) {
    this.departamento = new Departamento;
    this.funcionarioId = funcionarioId;
  }
}

export class PessoaFiltro {
  codigo?: string;
  nome?: string;
  departamento?: string;
  pagina = 0;
  itensPorPagina = 10;
}

export class Subitem {
  id!: number;
  descricao!: string;
  complementoTipo!: string;
  complementoPlaceholder!: string;
  numeroDigitosFracaoMin!: number;
  numeroDigitosFracaoMax!: number;
  numeroUnidadeMedida!: string;
  valorSubitem!: string;
  complementoSubitem: string | null = null;
}

export class Item {
  id!: number;
  descricao!: string;
  subitens!: Subitem[];
}

export class Checklist {
  id!: number;
  formularioId!: string;
  descricao!: string;
  itens!: Item[];
}

export class Inspecao {
  id!: number;
  dataHoraInicio!: Date;
  dataHoraFim!: Date;
  dataHoraAlteracao!: Date;
  dataHoraConferencia!: Date;
  checklist!: Checklist;
  observacoes: string | null = null;
  resultado!: string;
  inspetor!: Pessoa;
  conferente!: Pessoa;
  status: number = 0;
  historicoAlteracoes!: LogAlteracao[];
}

export class FiltroDepartamento {
  codigo!: number;
  nome!: string;
  pagina = 0;
  itensPorPagina = 10;
}

export class FiltroInspecao {

  // parâmetros de filtros globais
  dataAberturaDe: Date;
  dataAberturaAte: Date;
  isFieldsetCollapsed: boolean;

  // parâmatros p/ consulta de Inspeções
  statusInspecoes: number[];
  pagina: number;
  itensPorPagina: number;

  constructor() {
    const filtroSalvo = sessionStorage.getItem('filtro');

    if (filtroSalvo) {
      const filtro = JSON.parse(filtroSalvo);
      this.dataAberturaDe = new Date(filtro.dataAberturaDe);
      this.dataAberturaAte = new Date(filtro.dataAberturaAte);
      this.isFieldsetCollapsed = filtro.isFieldsetCollapsed;
      this.statusInspecoes = filtro.statusInspecoes;
      this.pagina = filtro.pagina;
      this.itensPorPagina = filtro.itensPorPagina;
    } else {
      this.dataAberturaDe = new Date();
      this.dataAberturaAte = new Date();
      this.isFieldsetCollapsed = true;
      this.statusInspecoes = [0, 1, 2]
      this.pagina = 0;
      this.itensPorPagina = 10;
    }

  }

  salvarFiltro() {
    const filtro = {
      dataAberturaDe: this.dataAberturaDe,
      dataAberturaAte: this.dataAberturaAte,
      isFieldsetCollapsed: this.isFieldsetCollapsed,
      statusInspecoes: this.statusInspecoes,
      pagina: this.pagina,
      itensPorPagina: this.itensPorPagina,
    };
    sessionStorage.setItem('filtro', JSON.stringify(filtro));
  }

}

export class LogAlteracao {
  dataHoraAlteracao!: Date;
  funcionarioNome!: string;
}

export class SumarioChecklist {
  id!: number;
  descricao!: string;
}

export interface DropdownItem {
  label: string;
  value: number;
}
