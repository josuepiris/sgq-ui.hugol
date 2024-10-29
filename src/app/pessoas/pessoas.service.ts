import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

import { Pessoa, Permissao, PessoaFiltro } from '../core/model';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PessoasService {

  usuariosUrl: string;
  pessoasUrl: string;

  constructor(private http: HttpClient) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
    this.pessoasUrl = `${environment.apiUrl}/funcionarios`;
  }

  pesquisar(filtro: PessoaFiltro): Observable<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });
  
    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo);
    } else {
      if (filtro.departamento) {
        params = params.append('departamento', filtro.departamento);
      }
  
      if (filtro.nome) {
        params = params.append('nome', filtro.nome);
      }
    }
  
    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .pipe(
        map(response => {
          const pessoas = response.content;
  
          const resultado = {
            pessoas,
            total: response.totalElements
          };
  
          return resultado;
        })
      );
  }

  pesquisarPessoas(codigoDepartamento: number): Observable<Pessoa[]> {
    const params = new HttpParams()
      .append('departamento', codigoDepartamento);

    return this.http.get<Pessoa[]>(this.pessoasUrl, {
      params
    });
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any>(`${this.pessoasUrl}?todos`);
  }

  listarAtivos(): Observable<any> {
    return this.http.get<any>(`${this.pessoasUrl}?ativos`);
  }

  listarUsuariosAtivos(): Observable<any> {
    return this.http.get<any>(`${this.usuariosUrl}?ativos`);
  }

  excluir(codigo: number): Observable<Object> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`);
  }

  mudarStatus(codigo: number, ativo: boolean): Observable<Object> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers });
  }

  adicionar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa);
  }

  atualizar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.funcionarioId}`, pessoa);
  }

  buscarPorCodigo(codigo: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`);
  }

  buscarListaPermissoes(): Observable<Permissao[]> {
    return this.http.get<Permissao[]>(`${this.pessoasUrl}/permissoes`);
  }

  atualizarListaPermissoes(funcionarioId: number, permissoes: Permissao[]): Observable<Permissao[]> {
    return this.http.put<Permissao[]>(`${this.pessoasUrl}/${funcionarioId}/permissoes`, permissoes);
  }

}
