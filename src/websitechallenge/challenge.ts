import { autoinject, observable } from 'aurelia-framework';
import { SupplierService, Supplier } from './supplier.service';
import {
  ProductService,
  ParentProduct,
  SelectedChildProduct,
} from './product.service';

@autoinject
export class Challenge {
  suppliers: Supplier[];
  products: ParentProduct[];
  selectedChildren: string[] = [];
  childProductIds: string[] = [];
  supplierSearchFilter: string[] = [];
  @observable query: string;

  title: string = 'Browse';
  returnFromSelectionTitle: string;
  selectedParentProduct: string = null;
  toastContainer: string;

  showModal: boolean = true;
  supplierPage: boolean = true;
  isContentShowing: boolean = true;
  showProductList: boolean = false;
  showArray: boolean = false;
  showProductChildren: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private productService: ProductService
  ) {}

  async bind() {
    this.suppliers = await this.supplierService.get();
  }

  private async getProducts() {
    let paginatedItem = await this.productService.get();
    this.products = paginatedItem.data;
  }

  toggleModalVisible() {
    this.showModal = !this.showModal;
  }

  async selectSupplier(supplier: Supplier) {
    this.title = supplier.name;
    await this.getProducts();
    this.showProductList = true;
    this.supplierPage = false;
    this.showProductChildren = false;
    this.showChildProducts(supplier.id);
    this.returnFromSelectionTitle = supplier.name;
  }

  backButton() {
    this.title = 'Browse';
    this.showProductList = false;
    this.supplierPage = true;
    this.selectedParentProduct = null;
  }

  selectParentProduct(productId: string) {
    this.selectedParentProduct = productId;
  }

  showChildProducts(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }

  checkboxfunc(childproduct: SelectedChildProduct, childId: string) {
    childproduct.isSelected = !childproduct.isSelected;
    if (!this.selectedChildren.includes(childproduct.name)) {
      this.selectedChildren.push(childproduct.name);
      this.toastContainer = 'Added ' + childproduct.name + ' successfully.';
    } else if (this.selectedChildren.includes(childproduct.name)) {
      let duplicateChildProduct = this.selectedChildren.indexOf(
        childproduct.name
      );

      if (duplicateChildProduct > -1) {
        this.selectedChildren.splice(duplicateChildProduct, 1);
      }

      this.toastContainer = 'Removed ' + childproduct.name + ' successfully.';
    }

    if (!this.childProductIds.includes(childId)) {
      this.childProductIds.push(childId);
    } else if (this.childProductIds.includes(childId)) {
      let duplicateChildId = this.childProductIds.indexOf(childId);

      if (duplicateChildId > -1) {
        this.childProductIds.splice(duplicateChildId, 1);
      }
    }

    // Checks the checkbox
    return true;
  }

  showChildren() {
    this.isContentShowing = false;
    this.showProductList = false;
    this.title = 'selection';
    this.showArray = true;
  }

  cancelSelection() {
    if ((this.showArray = true)) {
      this.isContentShowing = true;
      this.showProductList = true;
      this.showArray = false;
      this.title = this.returnFromSelectionTitle;
    }
  }

  getProductAmount(productAmount: number) {
    console.log(productAmount);
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
