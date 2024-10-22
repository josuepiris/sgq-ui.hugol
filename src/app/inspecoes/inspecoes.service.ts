import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { Checklist, FiltroInspecao, Inspecao, SumarioChecklist } from '../core/model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InspecoesService {

  servicoUrl!: string;
  servicosUrl: string;
  checklistUrl: string;
  equipamentosUrl: string;
  pneusUrl: string;
  inspecoesUrl: string;

  constructor(private httpClient: HttpClient) {
    this.servicosUrl = `${environment.apiUrl}/servicos`;
    this.checklistUrl = `${environment.apiUrl}/checklists`;
    this.equipamentosUrl = `${environment.apiUrl}/equipamentos`;
    this.pneusUrl = `${environment.apiUrl}/pneus`;
    this.inspecoesUrl = `${environment.apiUrl}/inspecoes`;
  }

  buscarChecklist(id: number): Observable<Checklist> {
    return this.httpClient.get<Checklist>(`${this.checklistUrl}/${id}`);
  }

  buscarInspecao(id: number): Observable<Inspecao> {
    return this.httpClient.get<Inspecao>(`${this.inspecoesUrl}/${id}`);
  }

  buscarInspecoes(filtro: FiltroInspecao): Observable<{ inspecoes: any[]; total: number }> {
    let params = new HttpParams();

    params = params.set('dataHoraInicioDe', filtro.dataAberturaDe.toLocaleDateString("sv-SE"));
    params = params.set('dataHoraInicioAte', filtro.dataAberturaAte.toLocaleDateString("sv-SE"));

    filtro.statusInspecoes.forEach(status => {
      params = params.append('status', status.toString());
    });

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    return this.httpClient.get<any>(`${this.inspecoesUrl}`, { params: params }).pipe(
      map(response => {
        const inspecoes = response.content;

        return {
          inspecoes,
          total: response.totalElements
        };
      })
    );
  }

  buscarSugestoesObservacoes(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.inspecoesUrl}/sugestoes-obs`);
  }

  buscarSumarioChecklists(): Observable<SumarioChecklist[]> {
    return this.httpClient.get<any[]>(`${this.checklistUrl}/sumario`);
  }

  criarInspecao(inspecao: Inspecao): Observable<Inspecao> {
    return this.httpClient.post<Inspecao>(this.inspecoesUrl, inspecao);
  }

  atualizarInspecao(inspecao: Inspecao): Observable<Inspecao> {
    return this.httpClient.put<Inspecao>(`${this.inspecoesUrl}/${inspecao.id}`, inspecao);
  }

  definirConferente(inspecaoId: number, funcionarioId: number): Observable<Inspecao> {
    let httpParams = new HttpParams().set('id', funcionarioId.toString());
    return this.httpClient.put<Inspecao>(
      `${this.inspecoesUrl}/${inspecaoId}/conferencia`, {}, { params: httpParams }
    );
  }
}
