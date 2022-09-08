export class SupplierService {
  async get(): Promise<Supplier[]> {
    let response = await fetch('suppliers.json');
    return await response.json();
  }
}

export interface Supplier {
  id: string;
  name: string;
  warehouseLocation: string;
  dosomething?: boolean;
}
