import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { IGenericResponse } from '../models/GenericResponse';
import { IGetProduct, IProduct } from '../models/Product';
import { BaseSearchCriteriaModel } from '@shared/models/ProductParam';
import { IPaginatedResult } from '@shared/models/PaginatedResult';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}

  getAll() {
    return this._httpClient.get<IGenericResponse<IGetProduct[]>>(
      this.baseUrl + 'Product/GetAll',
      { withCredentials: true }
    );
  }
  getById(id: string) {
    return this._httpClient.get<IGenericResponse<IGetProduct>>(
      this.baseUrl + 'Product/' + id,
      { withCredentials: true }
    );
  }
  create(category: FormData) {
    return this._httpClient.post<IGenericResponse<IProduct>>(
      this.baseUrl + 'Product/Create',
      category,
      { withCredentials: true }
    );
  }
  update(category: FormData) {
    return this._httpClient.put<IGenericResponse<IProduct>>(
      this.baseUrl + 'Product/Update',
      category,
      { withCredentials: true }
    );
  }
  Delete(id: string) {
    return this._httpClient.delete<IGenericResponse<boolean>>(
      this.baseUrl + 'Product/' + id,
      { withCredentials: true }
    );
  }
  getAllWithPagination(ProductParam: BaseSearchCriteriaModel) {
    let params = new HttpParams();
    if (ProductParam.categoryId)
      params = params.append('categoryId', ProductParam.categoryId);
    if (ProductParam.searchTerm)
      params = params.append('searchTerm', ProductParam.searchTerm);
    if (
      ProductParam.orderingEnum !== null &&
      ProductParam.orderingEnum !== undefined
    )
      params = params.append('orderingEnum', ProductParam.orderingEnum);

    params = params.append('pageSize', ProductParam.pageSize);
    params = params.append('pageNumber', ProductParam.pageNumber);
    return this._httpClient.get<IPaginatedResult<IGetProduct>>(
      environment.baseUrl + 'Product/PaginatedList',
      {
        params: params,
      }
    );
  }
  getAllNew() {
    return this._httpClient.get<IGenericResponse<IGetProduct[]>>(
      this.baseUrl + 'Product/GetAllNew',
      { withCredentials: true }
    );
  }
}
