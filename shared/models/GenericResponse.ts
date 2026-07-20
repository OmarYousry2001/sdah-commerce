export interface IGenericResponse<T> {
  statusCode: number;
  meta: any;
  succeeded: boolean;
  message: string;
  errors: any;
  type: number;
  data: T;
}