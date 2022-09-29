export class ProductService {
  async get(): Promise<PaginatedItem> {
    let response = await fetch('products.json');
    return await response.json();
  }
}

export interface PaginatedItem {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: ParentProduct[];
}

export interface ParentProduct {
  id: string;
  name: string;
  supplierId: string;
  childProducts: ChildProduct[];
}

export interface ChildProduct {
  id: string;
  sku: string;
  name: string;
  purchasePrices: PurchasePrice[];
}

export interface SelectedChildProduct extends ChildProduct {
  isSelected: boolean;
  quantity: number;
}

export interface PurchasePrice {
  price: number;
  currency: string;
  quantityStart: number;
  quantityEnd: number;
}
