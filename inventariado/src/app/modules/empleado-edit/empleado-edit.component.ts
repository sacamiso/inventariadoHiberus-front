import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from 'src/app/core/model/empleado.model';
import { EmpleadoService } from 'src/app/core/services/empleado.service';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MesaggeResponse, MesaggeResponseNumber } from 'src/app/core/model/mesagge-response.model';
import { Rol } from 'src/app/core/model/rol.model';
import { Oficina } from 'src/app/core/model/oficina.model';
import { RolService } from 'src/app/core/services/rol.service';
import { OficinaService } from 'src/app/core/services/oficina.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';



@Component({
  selector: 'app-empleado-edit',
  templateUrl: './empleado-edit.component.html',
  styleUrls: ['./empleado-edit.component.css']
})
export class EmpleadoEditComponent implements OnInit {

  empleado: Empleado | undefined;
  cargado = false;
  id: number;

  empleadoForm: FormGroup;

  msg: MesaggeResponse | undefined;
  alertPlaceholder: HTMLElement | null;

  listRoles: Array<Rol> = [];
  listOficinas: Array<Oficina> = [];

  formularioEnviado = false;

  user: Empleado | null = null;
  esElUsuarioLog: boolean = false;
  subject = this.authService.loginSubject.subscribe((value) => { this.refreshHeader(); });


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly empleadoService: EmpleadoService,
    private readonly router: Router,
    private location: Location,
    private readonly rolService: RolService,
    private readonly oficinaService: OficinaService,
    private authService: AuthService
  ) { 
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.empleadoForm = this.formBuilder.group({
      dni: ['', [Validators.required, this.validarDNI, this.noSoloEspacios]],
      nombre: ['', [Validators.required, this.noSoloEspacios]],
      apellidos: ['', [Validators.required, this.noSoloEspacios]],
      correo: ['', [Validators.required, this.noSoloEspacios, Validators.email]],
      usuario: ['', [Validators.required, this.noSoloEspacios]],
      codRol: ['', [Validators.required, this.noSoloEspacios]],
      idOficina: [0, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]]
    });

    this.alertPlaceholder = document.getElementById('liveAlert');
  }

  ngOnInit(): void {
    this.cargaDatos();
    
  }

  async refreshHeader() {
    
    await this.authService.getLoggedUser()
      .then((user) => {
        this.user = user;
        this.authService.usuarioActual = user;
      })
      .catch((error) => { this.user = null; })
    if(Number(this.authService.userId) == this.id){
      this.esElUsuarioLog = true;
    }else{
      this.esElUsuarioLog = false;
    }
  }

  async cargaDatos() {
    await this.getEmpleado();
    await this.getRoles();
    await this.getOficinas();
    this.refreshHeader();
    this.selectedOficina = this.listOficinas.find(oficina => oficina.idOficina === this.empleado?.idOficina);
    this.lastSelectedOficina = this.selectedOficina;

    this.empleadoForm.patchValue({
      dni: this.empleado?.dni,
      nombre: this.empleado?.nombre,
      apellidos: this.empleado?.apellidos,
      correo: this.empleado?.correo,
      usuario: this.empleado?.usuario,
      codRol: this.empleado?.codRol,
      idOficina: this.empleado?.idOficina
    })
    this.cargado = true;
  }

  async getEmpleado(){
    this.empleado = (await firstValueFrom(this.empleadoService.getEmpleadoById(this.id))).message;
  }

  async getRoles(){
    this.listRoles = await firstValueFrom(this.rolService.getAllRoles());
  }

  async getOficinas(){
    this.listOficinas = await firstValueFrom(this.oficinaService.getAllOficinas());
  }

  validarDNI(control: any) {
    const dni = control.value;
    const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i; // Expresión regular para validar DNI
    if (!dniRegex.test(dni)) {
      return { dniInvalido: true }; // DNI inválido si no coincide con el formato esperado
    }

    const letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
    const numero = dni.substr(0, dni.length - 1);
    const letraCalculada = letras[numero % 23];

    if (letraCalculada !== dni.charAt(dni.length - 1).toUpperCase()) {
      return { dniInvalido: true }; // La letra del DNI no coincide con la letra calculada
    }

    return null; // DNI válido
  }

  noSoloEspacios(control: any) {
    const valor = control.value;
    if (valor.trim() === '') {
      return { noSoloEspacios: true }; // Cadena compuesta solo de espacios
    }
    return null; // Cadena no compuesta solo de espacios
  }


  guardar() {
    this.formularioEnviado = true;
    if (this.empleadoForm.invalid){
      return;
    }

    this.empleado = this.empleadoForm.getRawValue() as Empleado;
    this.trimStringProperties(this.empleado);
    this.guardarFormulario();
  }

  guardarFormulario(){
    if(this.empleado){
      this.empleadoService.editarEmpleado(this.empleado, this.id).subscribe({
        next: (response) => {
          this.msg = response;
          if(this.msg.success){
            this.alerta('Empleado editado con éxito', 'success');
            this.formularioEnviado=false;
          }else{
            this.alerta(this.msg.error, 'danger');
          }
        },
        error: (error) => {
          this.alerta(error.error.error, 'danger');
        }
      })
    }
    
  }

  alerta(message: string, type: string) {
    this.alertPlaceholder = document.getElementById('liveAlert');
    if (!this.alertPlaceholder) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert"> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

    this.alertPlaceholder.appendChild(wrapper);

    // Establecer un temporizador para eliminar la alerta después de 20 segundos
    setTimeout(() => {
      wrapper.remove(); // Eliminar la alerta del DOM
    }, 5000);
  }

  trimStringProperties(obj: any) {
    for (const prop in obj) {
        if (typeof obj[prop] === 'string') {
            if (obj[prop].trim() === '') {
                obj[prop] = null;
            } else {
                obj[prop] = obj[prop].trim();
            }
        }
    }
  }

  volver(){
    this.location.back();
  }

  //cambios para el select autocompletable de filtro de oficinas

  filteredOficina: Array<Oficina> = [];
  selectedOficina: Oficina | undefined;
  lastSelectedOficina: Oficina | undefined;

  onSelectOficina(event: any) {
    // Cuando seleccionas una oficina del dropdown, actualiza el objeto seleccionado
    this.selectedOficina = event;
    this.lastSelectedOficina = event;
    this.empleadoForm.get('idOficina')?.setValue(event.idOficina);
  }

  onClearOficina() {
    if (this.lastSelectedOficina){
      this.selectedOficina = this.lastSelectedOficina;
      this.empleadoForm.get('idOficina')?.setValue(this.lastSelectedOficina.idOficina);
    }  else {
      this.selectedOficina = undefined; 
      this.empleadoForm.get('idOficina')?.setValue(null);
    }
  }

  checkIfValidInputOficina(event: KeyboardEvent) {
    const inputValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Verificar si el texto introducido coincide con alguna de las opciones
    const match = this.listOficinas.some(oficina => 
        this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue,
    );
    if (!match) {
      this.onClearOficina();
    }else{
      this.listOficinas.forEach(oficina => {
        if(this.getFullDescriptionOficina(oficina).toLowerCase()===inputValue){
          this.selectedOficina = oficina;
          this.empleadoForm.get('idOficina')?.setValue(oficina.idOficina);
          this.lastSelectedOficina = oficina;
          return;
        }
      });
    }
    (event.target as HTMLInputElement).value = '';
  }

  getFullDescriptionOficina(oficina: Oficina) {
    return `${oficina.direccion}, ${oficina.localidad}`;
  }

  filterOficina(event: any) {
    let query = event.query;
    this.filteredOficina = this.listOficinas.filter(oficina => {
        const fullDescriptionOficina = `${oficina.direccion}, ${oficina.localidad}`;
        return fullDescriptionOficina.toLowerCase().includes(query.toLowerCase());
    });
  }

  //Fin cambios para el select autocompletable de filtro de oficinas
}
