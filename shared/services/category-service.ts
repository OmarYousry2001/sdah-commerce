import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { IGenericResponse } from '../models/GenericResponse';
import { ICategory } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}
  getAll() {
    return this._httpClient.get<IGenericResponse<ICategory[]>>(
      this.baseUrl + 'Category/GetAll',
      { withCredentials: true }
    );
  }
  getById(id: string) {
    return this._httpClient.get<IGenericResponse<ICategory>>(
      this.baseUrl + 'Category/' + id,
      { withCredentials: true }
    );
  }
  create(category: ICategory) {
    return this._httpClient.post<IGenericResponse<ICategory>>(
      this.baseUrl + 'Category/Create',
      category,
      { withCredentials: true }
    );
  }
  update(category: ICategory) {
    return this._httpClient.put<IGenericResponse<ICategory>>(
      this.baseUrl + 'Category/Update',
      category,
      { withCredentials: true }
    );
  }
  Delete(id: string) {
    return this._httpClient.delete<IGenericResponse<boolean>>(
      this.baseUrl + 'Category/' + id,
      { withCredentials: true }
    );
  }
}
