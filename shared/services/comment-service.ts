import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IGenericResponse } from '../models/GenericResponse';
import { IComment, ICommentPublic } from '../models/Comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}
  getAll() {
    return this._httpClient.get<IGenericResponse<IComment[]>>(
      this.baseUrl + 'Comment/GetAll',
      { withCredentials: true }
    );
  }
  getById(id: string) {
    return this._httpClient.get<IGenericResponse<IComment>>(
      this.baseUrl + 'Comment/' + id,
      { withCredentials: true }
    );
  }
  create(comment: IComment) {
    return this._httpClient.post<IGenericResponse<IComment>>(
      this.baseUrl + 'Comment/Create',
      comment,
      { withCredentials: true }
    );
  }
  update(comment: IComment) {
    return this._httpClient.put<IGenericResponse<IComment>>(
      this.baseUrl + 'Comment/Update',
      comment,
      { withCredentials: true }
    );
  }
  delete(id: string) {
    return this._httpClient.delete<IGenericResponse<boolean>>(
      this.baseUrl + 'Comment/' + id,
      { withCredentials: true }
    );
  }

  getAllForUser() {
    return this._httpClient.get<IGenericResponse<ICommentPublic[]>>(
      this.baseUrl + 'Comment/GetAllForUsers',
      { withCredentials: true }
    );
  }
}
