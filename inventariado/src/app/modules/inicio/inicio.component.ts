import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/core/model/empleado.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  user: Empleado | null = null;
  isLogged: boolean = false;
  isAdmin: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });


  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.refreshHeader();
  }

  async refreshHeader() {

    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => { this.user = null; })
    this.isLogged = this.authService.isLogged();
    this.isAdmin = this.authService.isAdmin;
    
  }
}
