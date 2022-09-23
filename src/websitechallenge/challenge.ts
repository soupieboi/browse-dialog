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
  selectedChildren: SelectedChildProduct[] = [];
  @observable query: string;

  title: string = 'Browse';
  selectedSupplier: string = null;
  selectedParentProduct: string = null;

  showModal: boolean = true;
  isContentShowing: boolean = true;
  showSelected: boolean = false;

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
    await this.getProducts();
    this.title = supplier.name;
    this.productFilter(supplier.id);
    this.selectedSupplier = supplier.name;
  }

  backButton() {
    this.title = 'Browse';
    this.selectedParentProduct = null;
    this.selectedSupplier = null;
  }

  selectParentProduct(productId: string) {
    if (this.selectedParentProduct === productId) {
      this.selectedParentProduct = null;
      return;
    }

    this.selectedParentProduct = productId;
  }

  productFilter(supplierId: string) {
    this.products = this.products.filter((c) => c.supplierId === supplierId);
  }

  checkboxfunc(childproduct: SelectedChildProduct) {
    childproduct.isSelected = !childproduct.isSelected;

    if (childproduct.isSelected) {
      this.selectedChildren.push(childproduct);
    } else {
      let index = this.selectedChildren.findIndex(
        (c) => c.id === childproduct.id
      );
      this.selectedChildren.splice(index, 1);
    }

    if (childproduct.quantity === undefined) {
      childproduct.quantity = 1;
    }

    console.log(childproduct.quantity);

    return true;
  }

  showChildren() {
    this.showSelected = true;
    this.title = 'Selection';
  }

  cancelSelection() {
    if ((this.showSelected = true)) {
      this.showSelected = false;
      this.title = this.selectedSupplier;
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
