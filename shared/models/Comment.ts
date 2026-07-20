export interface IComment {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdDateUtc?: Date;
}

export interface ICommentPublic {
  name: string;
  message: string;
}
