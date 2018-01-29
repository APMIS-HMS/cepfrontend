import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility,User } from '../../../../models/index';
import { FormControl } from '@angular/forms';
import { ProductTypeService, ProductService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-product-manager-landingpage',
  templateUrl: './product-manager-landingpage.component.html',
  styleUrls: ['./product-manager-landingpage.component.scss']
})
export class ProductManagerLandingpageComponent implements OnInit {
  addProduct = false;
  productCat = false;
  generic = false;
  productRoute = false;
  manufacturer = false;
  presentation = false;


  deactivateButton = 'Deactivate';
  selectedFacility: Facility = <Facility>{};
  slideProductDetails = false;
  selectedProduct: any = <any>{};
  selectedValue: any = <any>{};
  user: User = <User>{};

  productTypes: any[] = [];
  products: any[] = [];
  selProductType = new FormControl();
  searchControl = new FormControl();
  constructor(private locker: CoolLocalStorage, private productTypeService: ProductTypeService,
    private productService: ProductService, private _productEventEmitter: ProductEmitterService,
   private facilitiesService: FacilitiesService) {
    this.productService.listenerUpdate.subscribe(payload => {
      this.getProducts();
    });
    this.productService.listenerCreate.subscribe(payload => {
      this.getProducts();
    });
  }

  ngOnInit() {
    this.user = <User>this.locker.getObject('auth');
    this._productEventEmitter.setRouteUrl('Product Manager');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getProducts();
    this.getProductTypes();

    // const subscribeForPerson = this.searchControl.valueChanges
    //   .debounceTime(200)
    //   .distinctUntilChanged()
    //   .switchMap((term: any[]) =>
    //     this.productService.find({
    //       query: {
    //         name: { $regex: this.searchControl.value, '$options': 'i' },
    //         facilityId: this.selectedFacility._id,
    //         $limit: 30
    //       }
    //     })
    //       .then(payload => {
    //         this.products = payload.data;
    //       }));

    // subscribeForPerson.subscribe((payload: any) => {
    // });
    // this.selProductType.valueChanges.subscribe(value => {
    //   this.productService.find({ query: { facilityId: this.selectedFacility._id, productTypeId: value, $limit: 30 } }).then(payload => {
    //     this.products = payload.data;
    //   });
    // });
  }

  private _notification(type: string, text: string): void {
    this.facilitiesService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  getProducts() {
    this.productService.find({ query: { facilityId: this.selectedFacility._id, $limit: 30 } }).then(payload => {
      this.products = payload.data;
    });
  }
  getProductTypes() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.productTypes = payload.data;
    });
  }


  slideProductDetailsToggle(value, event) {
    this.selectedProduct = value;
    this.slideProductDetails = !this.slideProductDetails;
  }

  close_onClick() {
    this.selectedProduct = <any>{};
    this.addProduct = false;
  }
  onSelectProduct(product) {
    this.deactivateButton = product.isActive ? 'Deactivate' : 'Activate';
    this.selectedProduct = product;
    this.addProduct = true;
  }
  onDeactivate(product) {
    this.deactivateButton = product.isActive ? 'Activate' : 'Deactivate';
    this.selectedProduct.isActive = !this.selectedProduct.isActive;
    this.productService.update(this.selectedProduct).then(payload => {
      this.selectedProduct = payload;
    });
  }
  onEdit(product) {
    this.addProduct = true;
  }
  addProductModal() {
    this.addProduct = true;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  productCatSlide() {
    this.addProduct = false;
    this.productCat = true;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  genericSlide() {
    this.addProduct = false;
    this.productCat = false;
    this.generic = true;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  presentationSlide() {
    this.addProduct = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = true;
  }
  routeSlide() {
    this.addProduct = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = true;
    this.manufacturer = false;
    this.presentation = false;
  }
  manufacturerSlide() {
    this.addProduct = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = true;
    this.presentation = false;
  }
  refresh(): void {
    // window.location.reload();
  }
}
