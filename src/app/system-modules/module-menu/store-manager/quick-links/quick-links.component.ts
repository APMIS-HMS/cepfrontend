import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss']
})
export class QuickLinksComponent implements OnInit {

  // products page
	addProduct: Boolean = false;
	isProductCat: Boolean = false;
	isGeneric: Boolean = false;
	isProductRoute: Boolean = false;
	isManufacturer: Boolean = false;
	isPresentation: Boolean = false;
	isStrength: Boolean = false;
	productCatPop: Boolean = false;


  constructor() { }

  ngOnInit() {
  }

  close_onClick(message: boolean): void {
		this.isProductCat = false;
		this.isGeneric = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.isProductRoute = false;
	}

  productCatPopShow() {
		this.addProduct = false;
		this.isProductCat = true;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.productCatPop = false;
  }

	genericSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = true;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
	}
	presentationSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = true;
		this.isStrength = false;
	}
	routeSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = true;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
	}
	manufacturerSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = true;
		this.isPresentation = false;
		this.isStrength = false;
	}

	strengthSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = !this.isStrength;
	}

}



