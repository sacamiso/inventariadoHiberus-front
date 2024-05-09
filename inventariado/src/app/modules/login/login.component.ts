import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { AuthResponse } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LOCAL_STORAGE } from 'src/app/utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = "";
  pass = "";
  messages: Message[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {  }

  ngOnInit(): void {
    if (this.authService.isLogged()) {
      this.router.navigate(['']);
    }
  }

  login() {
    this.authService.login(this.user, this.pass, '').subscribe({
      next: (response: AuthResponse) => {
        if (response) {
          localStorage.removeItem(LOCAL_STORAGE.USUARIO_TOKEN);
          localStorage.setItem(LOCAL_STORAGE.USUARIO_TOKEN, response.jwt);
          this.authService.loginSubject.next(true);
          this.router.navigate(['']);
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Las credenciales son incorrectas.' }];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Las credenciales son incorrectas.' }];
      }
    }
    );
  }
}
