import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CrudService } from '../core/services/crud.service';
import { MonedaResponse } from '../core/model/MonedaResponse.dto';
import { NgClass } from '@angular/common';
import { MonedaSearchRequest } from '../core/model/MonedaSearchRequest.dto';
import { Paginacion } from '../core/model/Paginacion.dto';
import { DtoPaginacionResponse } from '../core/model/DtoResponse.dto';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [ReactiveFormsModule, SweetAlert2Module, NgClass],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent implements OnInit {

  titleAction: string = 'Agregar';
  isEdit: boolean = false;

  form!: FormGroup;
  formEditAux!: FormGroup;

  formSearch!: FormGroup;
  dtoRequestSearch!: MonedaSearchRequest;
  private dtoPaginacion: Paginacion = new Paginacion();

  data: MonedaResponse[] = [];
  paginacionResponse!: DtoPaginacionResponse;

  constructor(
    private fb: FormBuilder,
    private crudService: CrudService
  ) {}

  ngOnInit(): void {
    this.form = this.initFormNew();
    this.initFormSearch();

    this.getAll();
  }

  private initFormNew(): FormGroup {
    return this.fb.group({
      claveMoneda: [''],
      descripcion: [''],
      simbolo: [''],
      abreviacion: [''],
      monedaCorriente: [''],
      status: ['']
    });
  }

  initFormSearch(): void {
    this.formSearch = this.fb.group({
      numCia: [''],
      claveMoneda: [''],
      descripcion: [''],
      simbolo: [''],
      abreviacion: [''],
      monedaCorriente: [''],
      status: ['']
    });
  }

  onSubmit(): void {
    this.classValidation();

    if(this.form.invalid){
      return;
    }

    if(this.isEdit){
      if(this.validateFormsMatch()) {
        this.info('¡No se detectaron cambios!', 'No se han detectado cambios en el registro.');
      }

      let numCia = this.data.find((item) => item.claveMoneda == this.form.controls['claveMoneda'].value)?.numCia;
      if(numCia){
        this.crudService.updateMoneda(numCia, this.form.value).subscribe(
          (resp) => {
            if(resp.codigo_estatus == 0){
              this.closeModal();
              this.success('¡Registro Actualizado!', 'El registro se ha actualizado correctamente.', true);
            }
        });
      } else {
        this.error();
      }
    } else {
      this.crudService.saveMoneda(this.form.value).subscribe(
        (resp) => {
          if(resp.status == 201){
            this.closeModal();
            this.success();
            this.dtoPaginacion = new Paginacion();
            this.getAll();
          }
      });
    }
  }

  registroNuevo(): void {
    this.titleAction = 'Agregar';
    this.isEdit = false;
    this.form = this.initFormNew();
    this.openModal();
  }

  getAll(): void {
    this.dtoRequestSearch = this.formSearch.value;
    this.crudService.findAll(this.dtoRequestSearch, this.dtoPaginacion).subscribe( (resp) => {
      if(resp.codigo_estatus == 0){
        this.data = [...resp.contenido];
        this.paginacionResponse = resp.paginacion;
      }
    });
  }

  onSubmitSearch(): void {
    this.dtoRequestSearch = this.formSearch.value;
    this.dtoPaginacion = new Paginacion();
    this.getAll();
  }

  edit(item: MonedaResponse): void {
    this.titleAction = 'Editar';
    this.isEdit = true;

    this.form = this.initFormNew();
    this.form.patchValue( {...item} );
    
    this.formEditAux = this.initFormNew();
    this.formEditAux.patchValue({...item});

    this.form.controls['claveMoneda'].disable();
    this.openModal();
  }

  delete(item: MonedaResponse): void {

    this.confirmacion('¿Estás seguro?', 'Eliminaras el siguiente registro: ' + item.claveMoneda, 'warning', 'Si, eliminar registro!').then((result) => {
      if(result){
        this.crudService.deleteMoneda(item.numCia).subscribe( (resp) => {
          if(resp.codigo_estatus == 0){
            this.dtoPaginacion = new Paginacion();
            this.getAll();
            this.success('¡Eliminación exitosa!', resp.mensajes[0]);
          }
        });
      }
    });
  }

  cancelarRegistro(): void {
    if(this.isEdit){
      this.form.controls['claveMoneda'].enable();

      if(this.validateFormsMatch()) {
        this.closeModal();
      } else {
        this.confirmacion().then((result) => {
          if(result){
            this.closeModal();
          }
        });
      }
      this.form.controls['claveMoneda'].disable();
    } else {
      let existsData = false;
      Object.keys(this.form.controls).forEach( (controlName) => {
        const control = this.form.get(controlName);
        if(control && control.value !== ''){
          existsData = true;
          return;
        }
      });
      
      if(existsData) {
        this.confirmacion().then((result) => {
          if(result){
            this.closeModal();
          }
        });
      } else {
        this.closeModal();
      } 
    }
  }

  onChangePaginacion(campo: string, event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;

    switch(campo){
      case 'campo':
        this.dtoPaginacion.sort = valor + ',' + this.dtoPaginacion.sort?.split(',')[1];
        break;
      case 'orden':
        this.dtoPaginacion.sort = this.dtoPaginacion.sort?.split(',')[0] + ',' + valor;
        break;
      case 'tam':
        this.dtoPaginacion.size = parseInt(valor);
        break;
      default:
        break;
    }
    this.getAll();
  }

  onChangePage(page: number): void {
    this.dtoPaginacion.page = page;
    this.getAll();
  }

  range(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
  }

  private openModal(): void {
    document.getElementById('modal')?.click();
  }

  private closeModal(): void {
    let form = document.getElementById('form');
    form?.classList.add('needs-validation');
    form?.classList.remove('was-validated');
    this.form.reset();
    document.getElementById('closeModal')?.click();
  }

  private classValidation(): void {
    let form = document.getElementById('form');
    form?.classList.remove('needs-validation');
    form?.classList.add('was-validated');
  }

  private validateFormsMatch(): boolean {
    return JSON.stringify(this.form.value) === JSON.stringify(this.formEditAux.value);
  }

  private async confirmacion(title: string = "¿Estás seguro?", text: string = "¡Perderas los datos ingresados!", icon: SweetAlertIcon = 'warning', confirmButtonText: string = "Sí, cerrar!", cancelButtonText: string = "Cancelar"): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#f49e53',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });
    return result.isConfirmed;
  }

  private success(title: string = '¡Registro exitoso!', text: string = 'El registro se ha guardado correctamente.', reload: boolean = false): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      position: 'top-end',
      timer: 3500,
      toast: true,
      showConfirmButton: false,
      didClose() {
          if(reload){
            window.location.reload();
          }
      },
    });
  }

  private info(title: string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      position: 'top-end',
      timer: 3500,
      toast: true,
      showConfirmButton: false,
    });
  }
  private error(title: string = 'Ocurrio un error!', text: string = 'Intenta de nuevo más tarde.'): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      position: 'top-end',
      timer: 3500,
      toast: true,
      showConfirmButton: false,
    });
  }
}