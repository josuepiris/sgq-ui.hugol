import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { map, Observable } from 'rxjs';

import { Departamento, FiltroDepartamento } from '../core/model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  departamentosUrl: string;

  constructor(private http: HttpClient) {
    this.departamentosUrl = `${environment.apiUrl}/departamentos`;
  }

  listarTodos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.departamentosUrl}`);
  }

  listarAtivos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.departamentosUrl}/ativos`)
  }

  pesquisar(
    filtro: FiltroDepartamento
  ): Observable<{ departamentos: Departamento[]; total: number }> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString(),
      },
    });

    if (filtro.codigo) {
      params = params.append('codigo', filtro.codigo.toString());
    } else if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http
      .get<{ content: Departamento[]; totalElements: number }>(
        `${this.departamentosUrl}/pesquisa`, { params }
      )
      .pipe(
        map((r: { content: Departamento[]; totalElements: number }) => ({
          departamentos: r.content, total: r.totalElements
        }))
      );
  }

  buscarPorCodigo(codigo: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.departamentosUrl}/${codigo}`);
  }

  adicionar(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.departamentosUrl, departamento);
  }

  atualizar(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(
      `${this.departamentosUrl}/${departamento.codigo}`, departamento
    )
  }

  excluir(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.departamentosUrl}/${codigo}`);
  }

  alterarStatus(codigo: number, ativo: boolean): Observable<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put<void>(`${this.departamentosUrl}/${codigo}/ativo`, ativo, { headers });
  }

}
