import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ISettings } from '../models/Settings';
import { environment } from '../environments/environment.development';
import { IGenericResponse } from '../models/GenericResponse';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}
  getAll() {
    return this._httpClient.get<IGenericResponse<ISettings[]>>(
      this.baseUrl + 'Settings/GetAll',
      { withCredentials: true }
    );
  }
  getById(id: string) {
    return this._httpClient.get<IGenericResponse<ISettings>>(
      this.baseUrl + 'Settings/' + id,
      { withCredentials: true }
    );
  }

  update(category: FormData) {
    return this._httpClient.put<IGenericResponse<ISettings>>(
      this.baseUrl + 'Settings/Update',
      category,
      { withCredentials: true }
    );
  }
}
