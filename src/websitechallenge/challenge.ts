import { stringify } from 'querystring';
import { autoinject } from 'aurelia-framework';
import { SupplierService, Supplier } from './supplier.service';
import { ProductService, ParentProduct } from './product.service';

@autoinject
export class Challenge {
  suppliers: Supplier[];
  title: string = 'Browse';
  showModal: boolean = true;
  number: number;
  products: ParentProduct[];
  productPage: boolean = false;

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

  private async getSuppliers() {
    for (let i of this.suppliers) {
    }
  }
  // open and close modal

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // show product list

  async selectSupplier(supplier: Supplier) {
    // supplier.name = this.suppliers[].name
    this.title = supplier.name;
    await this.getProducts();
    this.productPage = true;
    await this.showChildProducts(supplier.id);
    console.log(await this.showChildProducts(supplier.id));
  }

  // returnButton functionality

  backButton() {
    this.title = 'Browse';
    this.productPage = false;
  }

  async printParentProducts(supplierId: string) {
    await this.showChildProducts(supplierId);
  }

  async showChildProducts(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }
}
