import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _service = inject(HttpClient);
  const router = inject(Router);
const baseURL=environment.baseUrl
  return _service.get(baseURL + "user/IsAuthenticated",{withCredentials:true}).pipe(
    map ( () =>  true),
    catchError(() => {
      router.navigate(["/admin/login"], { queryParams: { returnUrl: state.url } });
      return of(false);  // return Observable<boolean>
    })
  )
};
