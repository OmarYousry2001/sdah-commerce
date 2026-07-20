import { OrderingEnum } from './OrderingEnum';

// export class ProductParam{
//     CategoryId: number = 0;
//     SortSelected: string = '';
//     search: string = '';
//     pageNumber:number=1;
//     pageSize:number=3
// }

export class BaseSearchCriteriaModel {
  searchTerm: string | null = '';
  pageNumber: number = 1;
  pageSize: number = 3;
  orderingEnum: OrderingEnum | null = null;
  categoryId: string | null = '';
}
