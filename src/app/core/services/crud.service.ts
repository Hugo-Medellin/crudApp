import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonedaSave } from '../model/MonedaSave.model';
import { Observable } from 'rxjs';
import { MonedaSearchRequest } from '../model/MonedaSearchRequest.dto';
import { Paginacion, PaginacionDto } from '../model/Paginacion.dto';
import { MonedaUpdate } from '../model/MonedaUpdate.dto';
import { DtoResponse } from '../model/DtoResponse.dto';
import { MonedaResponse } from '../model/MonedaResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private baseUrl = 'http://localhost:8080/api/moneda';

  constructor(
    private http: HttpClient
  ) { }


  //CREATE
  saveMoneda(data: MonedaSave): Observable<any> {
    return this.http.post(this.baseUrl, data, {observe: 'response'});
  }


  //READ
  findAll(monedaRequest: MonedaSearchRequest, paginacion: Paginacion): Observable<DtoResponse<MonedaResponse[]>> {
    let httpParams = new HttpParams();

    Object.keys(monedaRequest).forEach(key => {
      if (monedaRequest[key]) {
        httpParams = httpParams.set(key, monedaRequest[key]+'');
      }
    });
    Object.keys(paginacion).forEach(key => {
      if (paginacion[key]) {
        httpParams = httpParams.set(key, paginacion[key]+'');
      }
    });
  
    return this.http.get<DtoResponse<MonedaResponse[]>>(this.baseUrl, {params: httpParams});
  }


  //UPDATE
  updateMoneda(numCia: number, data: MonedaUpdate): Observable<DtoResponse<String>> {
    return this.http.put<DtoResponse<String>>(this.baseUrl+'/num-cia/'+numCia, data);
  }

  //DELETE
  deleteMoneda(numCia: number): Observable<DtoResponse<String>> {
    return this.http.delete<DtoResponse<String>>(this.baseUrl+'/num-cia/'+numCia);
  }
}