import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs';
import { IGenericResponse } from '../models/GenericResponse';
import { ResetPasswordForm } from '../models/ResetPassowrd';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  baseURL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  Login(form: any) {
    return this.http.post(this.baseURL + 'Authentication/Login', form, {
      withCredentials: true,
    });
  }
  SendResetPassword(email: string) {
    return this.http.get(
      this.baseURL + `User/SendResetPassword?email=${email}`
    );
  }
  ResetPassword(param: ResetPasswordForm) {
    return this.http.post<IGenericResponse<string>>(
      this.baseURL + 'User/ResetPassword',
      param
    );
  }

  logout() {
    return this.http.get(this.baseURL + 'Authentication/Logout', {
      withCredentials: true,
    });
  }
  ChangePassword(form: any) {
    return this.http.post<IGenericResponse<string>>(
      this.baseURL + 'User/ChangePassword',
      form,
      { withCredentials: true }
    );
  }

  isUserAuthenticated() {
    return this.http
      .get(this.baseURL + 'user/IsAuthenticated', {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.status === 200;
        })
      );
  }
}
