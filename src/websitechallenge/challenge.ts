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
  productCounters: string[] = [];
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
  isDropDownActive: boolean = true;
  productCounter: number;

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
    if (this.selectedParentProduct === productId) {
      this.selectedParentProduct = null;
      return;
    }

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

  updateProductCounter(currentProductCount: string, childProductName: string) {
    console.log(currentProductCount);
    console.log(childProductName);

    let productInfo = { name: childProductName, count: currentProductCount };

    if (!this.productCounters.includes(childProductName)) {
      this.productCounters.push(productInfo.name);
      this.productCounters.push(productInfo.count);
      console.log(this.productCounters);
    } else if (this.productCounters.includes(childProductName)) {
      let getUpdatedCounterValue =
        this.productCounters.indexOf(childProductName);
      this.productCounters.splice(getUpdatedCounterValue, 1, productInfo.name);
      this.productCounters.splice(
        getUpdatedCounterValue + 1,
        1,
        productInfo.count
      );
      console.log(this.productCounters);
    }
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
    // // split op punt
    // // loop door alle items in array en neem eerste property, 'childProducts'
    // // next loop, loop door items in second property heen
    // // done...
    const properties = Array.isArray(property) ? property : [property];

    // console.log(properties);
    // console.log(array);

    // let henk = array.filter(function (e) {
    //   // console.log(index);
    //   // return e['name'].sta === query;
    //   for (const item of e['childProducts']) {
    //     if (item.name.startsWith(query)) {
    //       return true;
    //     }
    //   }
    //   return false;
    // });

    // console.log(henk);

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
