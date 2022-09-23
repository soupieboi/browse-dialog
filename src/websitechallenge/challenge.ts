import { autoinject, observable } from 'aurelia-framework';
import {
  ParentProduct,
  ProductService,
  SelectedChildProduct,
} from './product.service';
import { Supplier, SupplierService } from './supplier.service';

@autoinject
export class Challenge {
  suppliers: Supplier[];
  products: ParentProduct[];
  selectedChildren: SelectedChildProduct[] = [];
  @observable query: string;

  title: string = 'Browse';
  selectedSupplier: string = null;
  selectedParentProduct: string = null;

  showModal: boolean = true;
  showSelected: boolean;

  constructor(
    private supplierService: SupplierService,
    private productService: ProductService
  ) {}

  async bind() {
    this.suppliers = await this.supplierService.get();
  }

  toggleModalVisible() {
    this.showModal = !this.showModal;
  }

  backButton() {
    this.title = 'Browse';
    this.selectedParentProduct = null;
    this.selectedSupplier = null;
  }

  async selectSupplier(supplier: Supplier) {
    await this.getProducts();
    this.title = supplier.name;
    this.productFilter(supplier.id);
    this.selectedSupplier = supplier.name;
  }

  productFilter(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }

  selectParentProduct(productId: string) {
    if (this.selectedParentProduct === productId) {
      this.selectedParentProduct = null;
      return;
    }

    this.selectedParentProduct = productId;
  }

  checkboxfunc(childproduct: SelectedChildProduct) {
    childproduct.isSelected = !childproduct.isSelected;

    // add - remove from Array
    if (childproduct.isSelected) {
      this.selectedChildren.push(childproduct);
    } else {
      let index = this.selectedChildren.findIndex(
        (c) => c.id === childproduct.id
      );
      this.selectedChildren.splice(index, 1);
    }

    childproduct.quantity = 1;

    return true;
  }

  private async getProducts() {
    let paginatedItem = await this.productService.get();
    this.products = paginatedItem.data;
  }
}

export class FilterValueConverter {
  toView(array: any[], property: any, query: string) {
    if (
      query === void 0 ||
      query === null ||
      query === '' ||
      !Array.isArray(array)
    ) {
      return array;
    }

    const properties = Array.isArray(property) ? property : [property];
    const term = String(query).toLowerCase();

    let startsWithResults = array.filter((entry) =>
      properties.some((prop) =>
        String(entry[prop]).toLowerCase().startsWith(term)
      )
    );

    let containsResults = array.filter((entry) =>
      properties.some(
        (prop) =>
          !String(entry[prop]).toLowerCase().startsWith(term) &&
          String(entry[prop]).toLowerCase().indexOf(term) >= 0
      )
    );

    return Array.from(new Set(startsWithResults.concat(containsResults)));
  }
}
