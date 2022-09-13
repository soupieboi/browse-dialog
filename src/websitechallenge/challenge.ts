import { autoinject } from 'aurelia-framework';
import { SupplierService, Supplier } from './supplier.service';
import { ProductService, ParentProduct, ChildProduct } from './product.service';
import { on } from 'events';

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
  currentChild: string;
  isReadOnly: boolean = true;
  readonlyProperty: string = 'readonly';
  inputIsBlur: boolean = true;
  totalSelected: number = 0;
  selectedChildArr: string[] = [];

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

  checkboxfunc(childproduct: string) {
    if (!this.selectedChildArr.includes(childproduct)) {
      this.selectedChildArr.push(childproduct)
    } else if (this.selectedChildArr.includes(childproduct)) {
      let duplicateChildProduct = this.selectedChildArr.indexOf(childproduct)
      
      if (duplicateChildProduct > -1) {
        this.selectedChildArr.splice(duplicateChildProduct, 1)
      }
    }

    console.log(this.selectedChildArr)
    
    return true;
  }

  checkSelected(childproduct: string) {
    let inputs = document.getElementsByClassName('productCount');

    // if (this.inputIsBlur = true) {
    // for (let index = 0; index < inputs.length; index++) {
    //   console.log((inputs[index] as HTMLInputElement).value);   
    //   }
    // }
    
    console.log(childproduct)


  }

  getUserInput() {


  }
}
