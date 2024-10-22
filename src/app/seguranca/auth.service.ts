import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oAuthTokenUrl: string;
  oAuthTokensRevokeUrl: string;

  jwtPayload: any;

  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.oAuthTokenUrl = `${environment.apiUrl}/oauth/token`;
    this.oAuthTokensRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic c2dxOnNncQ==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return firstValueFrom(this.httpClient.post<any>(this.oAuthTokenUrl, body, { headers, withCredentials: true }))
      .then(r => {
        this.armazenarToken(r.access_token);
      })
      .catch(r => {
        const responseError = r.error;
        if (r.status === 400) {
          if (responseError.error === 'invalid_grant') {
            return Promise.reject('Oops! Usuário e/ou senha incorretos.');
          }
        }
        return Promise.reject(r);
      });
  }

  logout() {
    return firstValueFrom(this.httpClient.delete(this.oAuthTokensRevokeUrl, { withCredentials: true }))
      .then(() => {
        this.jwtPayload = null;
        sessionStorage.removeItem('token');
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic c2dxOnNncQ==');

    const body = 'grant_type=refresh_token';

    return firstValueFrom(this.httpClient.post<any>(this.oAuthTokenUrl, body, { headers, withCredentials: true }))
      .then(r => {
        this.armazenarToken(r.access_token);
      })
      .catch(r => {
        console.error('Erro ao renovar token!', r);
      });
  }

  isAccessTokenInvalido() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return true;
    } else if (this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      return false;
    }
  }

  temPermissao(permissao: string) {
    if (this.jwtPayload && this.jwtPayload.authorities) {
      return this.jwtPayload.authorities.includes(permissao);
    } else {
      return false;
    }
  }

  temQualquerPermissao(roles: any) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    sessionStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = sessionStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}
