import { autoinject } from 'aurelia-framework';
import { SupplierService, Supplier } from './supplier.service';
import {
  ProductService,
  ParentProduct,
  PaginatedItem,
} from './product.service';

@autoinject
export class Challenge {
  suppliers: Supplier[];
  title: string = 'Browse';
  searchPlaceHolder: string = 'Search suppliers';
  showModal: boolean = true;
  number: number;
  products: ParentProduct[];
  showProductList: boolean = false;
  supplierPage: boolean = true;
  rotatedArrow: string = 'arrow-right';

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

  // show product list

  async selectSupplier(supplier: Supplier) {
    this.title = supplier.name;
    await this.getProducts();
    this.showProductList = true;
    this.supplierPage = false;
    this.searchPlaceHolder = 'Search Products';
    await this.showChildProducts(supplier.id);
  }

  async selectProduct() {
    await this.getProducts();
  }

  // returnButton functionality

  backButton() {
    this.title = 'Browse';
    this.showProductList = false;
    this.supplierPage = true;
    this.searchPlaceHolder = 'Search suppliers';
  }

  async printParentProducts(supplierId: string) {
    await this.showChildProducts(supplierId);
  }

  async showChildProducts(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }
}
