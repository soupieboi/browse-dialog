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
  multipleProduct: string = 'products';
  selectedButtoncolor: string ='no-product-selected';
  addButtoncolor: string = 'inactive-add-button';
  addCancelbuttoncolor: string = 'cannot-cancel';
  isContentShowing: boolean = true;
  isSelectpageAvailable: boolean = false;
  isArrayDisplayed: boolean = false;
  childProductIdArr: string[] = [];

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

  checkboxfunc(childproduct: string, childId: string) {
    if (!this.selectedChildArr.includes(childproduct)) {
      this.selectedChildArr.push(childproduct)
    } else if (this.selectedChildArr.includes(childproduct)) {
      let duplicateChildProduct = this.selectedChildArr.indexOf(childproduct)
      
      if (duplicateChildProduct > -1) {
        this.selectedChildArr.splice(duplicateChildProduct, 1)
      }
    }

    this.totalSelected = this.selectedChildArr.length

    if (this.totalSelected === 1) {
      this.multipleProduct = 'product'
      this.selectedButtoncolor = 'product-is-selected'
      this.addButtoncolor = 'active-add-button'
      this.isSelectpageAvailable = true;
    } else if (this.totalSelected > 1) {
      this.multipleProduct = 'products'
      this.selectedButtoncolor = 'product-is-selected'
      this.addButtoncolor = 'active-add-button'
      this.isSelectpageAvailable = true;
    } else if (this.totalSelected < 1) {
      this.multipleProduct = 'products'
      this.selectedButtoncolor = 'no-product-selected'
      this.addButtoncolor = 'inactive-add-button'
      this.isSelectpageAvailable = false;
    }

    if (!this.childProductIdArr.includes(childId)) {
      this.childProductIdArr.push(childId)
    } else if (this.childProductIdArr.includes(childId)) {
      let duplicateChildId = this.childProductIdArr.indexOf(childId)
      
      if (duplicateChildId > -1) {
        this.childProductIdArr.splice(duplicateChildId, 1)
      }
    }

    console.log(this.childProductIdArr)
    console.log(this.selectedChildArr)
    
    return true;
  }

  showChildArr() {
    if (this.isSelectpageAvailable === true) {
      this.isContentShowing = false;
      this.showProductList = false;
      this.title = 'selection';
      this.isArrayDisplayed = true;
      this.addCancelbuttoncolor = 'canCancel';
    }
  }

  cancelSelection() {
    if (this.isArrayDisplayed = true) {
      this.addCancelbuttoncolor = 'cannotCancel';
      this.isContentShowing = true;
      this.showProductList = true;
      this.isArrayDisplayed = false;
    }
  }

  rememberChecked() {
    console.log(this.childProductIdArr)
  }
}
