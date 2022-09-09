import { autoinject } from 'aurelia-framework';
import { SupplierService, Supplier } from './supplier.service';
import { ProductService, ParentProduct } from './product.service';

@autoinject
export class Challenge {
  suppliers: Supplier[];
  title: string = 'Browse';
  searchPlaceHolder: string = 'Search suppliers';
  showModal: boolean = true;
  number: number;
  products: ParentProduct[];
  showProductList: boolean = false;
  showProductChildren: boolean = false;
  supplierPage: boolean = true;
  rotatedArrow: string = 'arrow-right';
  showChildInfo: boolean = false;
  selectedParentProduct: string = null;
  isProductDropDownActive: boolean = false;
  hoverCSS: string = 'background: white;';

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
  // open and close modal

  toggleModal() {
    this.showModal = !this.showModal;
  }

  animatedArrow(chosenProduct: string) {
    if (this.rotatedArrow === 'activeArrow') {
      this.rotatedArrow = 'arrow-right';
    } else {
      this.rotatedArrow = 'activeArrow';
    }
    console.log();
  }

  async selectSupplier(supplier: Supplier) {
    this.title = supplier.name;
    await this.getProducts();
    this.showProductList = true;
    this.supplierPage = false;
    this.searchPlaceHolder = 'Search Products';
    this.showProductChildren = false;
    this.showChildProducts(supplier.id);
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
  }

  showChildProducts(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }

  toggleProductDropdown() {
    this.isProductDropDownActive = !this.isProductDropDownActive;
  }

  showHoverColor() {
    if (this.isProductDropDownActive === true) {
      return;
    } else {
      this.hoverCSS = 'background: rgba(47, 141, 248, 0.99);';
    }
  }
}
