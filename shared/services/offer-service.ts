import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IGenericResponse } from '../models/GenericResponse';
import { IGetOffer, IOffer } from '../models/Offer';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}
  getAll() {
    return this._httpClient.get<IGenericResponse<IGetOffer[]>>(
      this.baseUrl + 'Offer/GetAll',
      { withCredentials: true }
    );
  }
  getById(id: string) {
    return this._httpClient.get<IGenericResponse<IGetOffer>>(
      this.baseUrl + 'Offer/' + id,
      { withCredentials: true }
    );
  }
  create(offer: FormData) {
    return this._httpClient.post<IGenericResponse<IOffer>>(
      this.baseUrl + 'Offer/Create',
      offer,
      { withCredentials: true }
    );
  }
  update(offer: FormData) {
    return this._httpClient.put<IGenericResponse<IOffer>>(
      this.baseUrl + 'Offer/Update',
      offer,
      { withCredentials: true }
    );
  }
  delete(id: string) {
    return this._httpClient.delete<IGenericResponse<boolean>>(
      this.baseUrl + 'Offer/' + id,
      { withCredentials: true }
    );
  }
}
