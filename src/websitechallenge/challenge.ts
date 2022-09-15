import { autoinject } from 'aurelia-framework';
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

  title: string = 'Browse';
  returnFromSelectionTitle: string;
  selectedParentProduct: string = null;
  searchPlaceHolder: string = 'Search suppliers';
  addButtoncolor: string = 'inactive-add-button';
  addCancelbuttoncolor: string = 'cannot-cancel';
  changeHoverEffect: string = 'nohoverproductlist';

  showModal: boolean = true;
  supplierPage: boolean = true;
  isContentShowing: boolean = true;
  showProductList: boolean = false;
  isArrayDisplayed: boolean = false;
  showProductChildren: boolean = false;
  isProductDropDownActive: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private productService: ProductService
  ) {}

  async attached() {
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
    this.searchPlaceHolder = 'Search Products';
    this.showProductChildren = false;
    this.showChildProducts(supplier.id);
    this.returnFromSelectionTitle = supplier.name;
  }

  backButton() {
    this.title = 'Browse';
    this.showProductList = false;
    this.supplierPage = true;
    this.searchPlaceHolder = 'Search suppliers';
    this.selectedParentProduct = null;
  }

  selectParentProduct(productId: string) {
    this.selectedParentProduct = productId;
    this.toggleProductDropdown();
    if (this.isProductDropDownActive === true) {
      this.changeHoverEffect = '#';
    }
  }

  showChildProducts(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }

  toggleProductDropdown() {
    this.isProductDropDownActive = !this.isProductDropDownActive;
  }

  checkboxfunc(childproduct: SelectedChildProduct, childId: string) {
    childproduct.isSelected = !childproduct.isSelected;
    if (!this.selectedChildren.includes(childproduct.name)) {
      this.selectedChildren.push(childproduct.name);
    } else if (this.selectedChildren.includes(childproduct.name)) {
      let duplicateChildProduct = this.selectedChildren.indexOf(
        childproduct.name
      );

      if (duplicateChildProduct > -1) {
        this.selectedChildren.splice(duplicateChildProduct, 1);
      }
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

  showChildArr() {
    this.isContentShowing = false;
    this.showProductList = false;
    this.title = 'selection';
    this.isArrayDisplayed = true;
  }

  cancelSelection() {
    if ((this.isArrayDisplayed = true)) {
      this.addCancelbuttoncolor = 'cannotCancel';
      this.isContentShowing = true;
      this.showProductList = true;
      this.isArrayDisplayed = false;
      this.title = this.returnFromSelectionTitle;
    }
  }
}
