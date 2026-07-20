// product.dto.ts

export interface IProduct {
  name: string;
  description: string;
  price: number;
  categoryId: string; // GUID as string
  imagePath?: string;
  image?: File;
}

export interface IGetProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  categoryName: string;
  isChecked: boolean;
  createdDateUtc: string;
}
