import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthRequest, AuthResponse, Empleado, EmpleadoMsg } from '../model/empleado.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, ROLES } from 'src/app/utils/constants';
import jwtDecode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;

  usuarioActual: Empleado | null = null;
  loginSubject = new BehaviorSubject(false);

  constructor(
    private readonly http: HttpClient,
    readonly router: Router
  ) { }

  decodificarToken(): any {
    try {
      return jwtDecode(localStorage.getItem(LOCAL_STORAGE.USUARIO_TOKEN) || '');
    } catch(Error) {
      return null;
    }
  }
  
  public get getRol() {
    if (this.usuarioActual===null || this.usuarioActual===undefined) {
      return null;
    }
    return this.usuarioActual?.rol;
  }

  public get isAdmin(): boolean {
    let tokenDecoded = this.decodificarToken();
    let rol = tokenDecoded?.rol;
    if (rol===null || rol===undefined) {
      return false;
    }
    return rol === ROLES.ADMINISTRADOR;
  }

  public get userId(): string {
    let tokenDecoded = this.decodificarToken();
    let id = tokenDecoded?.id;
    if (id===null || id===undefined) {
      return id;
    }
    return id;
  }

  isLogged(): boolean {
    let jwt = localStorage.getItem(LOCAL_STORAGE.USUARIO_TOKEN);
    if (jwt != null) {
      return true;
    } else {
      return false;
    }
  }

  getLoggedUser(): Promise<Empleado | null> {
    if (!this.isLogged()) { return Promise.resolve(this.usuarioActual); }
    if (this.usuarioActual != null) { return Promise.resolve(this.usuarioActual); }
    return new Promise<Empleado>((resolve, reject) => {
      this.http.get<EmpleadoMsg>(`${this.apiUrl}/auth/user`, {
        observe: 'body'
      }).subscribe({
        next: (response: EmpleadoMsg) => {
          if (response.success) {
            resolve(response.message);
          } else {
            reject(response.error);
          }
        }, error: (error) => {
          reject('Error al obtener el usuario loggeado')
        }
      });
    });
  }

  login(login: string, pass: string, dni: string): Observable<AuthResponse> {
    const authRequest: AuthRequest = {
      dni: dni,
      username: login,
      pass: pass
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, authRequest);
  }

  logout(): void {
    localStorage.removeItem(LOCAL_STORAGE.USUARIO_TOKEN);
    this.usuarioActual = null;
    this.router.navigate(['']);
    this.loginSubject.next(false);
  }

  refreshLogin(): void {
    if (this.isLogged()) {
      this.loginSubject.next(true);
    } else {
      this.loginSubject.next(false);
    }
  }
}
