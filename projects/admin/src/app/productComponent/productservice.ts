// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment.development';
// import { HttpClient } from '@angular/common/http';
// import { IGetProduct, IProduct } from '../shared/models/Product';
// import { IGenericResponse } from '../shared/models/GenericResponse';

// @Injectable({
//   providedIn: 'root'
// })
// export class Productservice {
//   baseUrl = environment.baseUrl;

//   constructor(private _httpClient: HttpClient) {}
//   getAll() {
//     return this._httpClient.get<IGenericResponse<IGetProduct[]>>(
//       this.baseUrl + "Product/GetAll" , { withCredentials: true }
//     );
//   }
//   getById(id: string) {
//     return this._httpClient.get<IGenericResponse<IGetProduct>>(
//       this.baseUrl + "Product/" + id  , { withCredentials: true }
//     );
//   }
//   create(category: FormData) {
//     return this._httpClient.post<IGenericResponse<IProduct>>(
//       this.baseUrl + "Product/Create",
//       category, { withCredentials: true }
//     );
//   }
//   update(category: FormData) {
//     return this._httpClient.put<IGenericResponse<IProduct>>(
//       this.baseUrl + "Product/Update",
//       category, { withCredentials: true }
//     );
//   }
//   Delete(id: string) {
//     return this._httpClient.delete<IGenericResponse<boolean>>(
//       this.baseUrl + "Product/" + id, { withCredentials: true }
//     );
//   }
// }
