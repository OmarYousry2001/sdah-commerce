import { IGetProduct } from '../models/Product';

export interface IOffer {
  id: string; // from BaseDTO (if exists)
  name: string;
  discountedPrice: number;
  description: string;
  imagePath?: string | null;
  image?: File | null;
  productIds: string[];
}

export interface IGetOffer extends IOffer {
  products: IGetProduct[];
  countProduct: number;
  priceBeforeDiscount: number;
}
