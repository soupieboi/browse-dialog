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
  changeHoverEffect: string = 'nohoverproductlist';
  isChecked: boolean = false;
  isReadOnly: boolean = true;
  readonlyProperty: string = 'readonly';

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

  checkboxfunc() {
    if (this.isChecked === false) {
      this.isChecked = true;
      console.log('now true!');
    } else {
      this.isChecked = false;
      console.log('now false!');
    }
    return true;
  }

  checkSelected() {
    let inputs = document.getElementsByClassName('productCount');

    for (let index = 0; index < inputs.length; index++) {
      console.log((inputs[index] as HTMLInputElement).value);
    }

    // console.log(input);
    // if (0 != input.length) {
    //   console.log(input);
    // }
  }

  getUserInput() {
    console.log(this.checkSelected());
  }
}
