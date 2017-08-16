import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductEmitterService } from '../../../services/facility-manager/product-emitter.service';
import { FacilitiesService } from '../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-product-manager',
	templateUrl: './product-manager.component.html',
	styleUrls: ['./product-manager.component.scss']
})

export class ProductManagerComponent implements OnInit {
	pageInView: String = "";
	productNavMenu: boolean = false;
	categoryNavMenu: boolean = false;
	supplierNavMenu: boolean = false;
	manufacturerNavMenu: boolean = false;
	routeNavMenu: boolean = false;
	genericNavMenu: boolean = false;
	presentationNavMenu: boolean = false;
	strengthNavMenu: boolean = false;
	contentSecMenuShow: boolean = false;

	//products page
	addProduct: boolean = false;
	productCat: boolean = false;
	generic: boolean = false;
	productRoute: boolean = false;
	manufacturer: boolean = false;
	presentation: boolean = false;
	strength: boolean = false;

	constructor(private _productEventEmitter: ProductEmitterService, private _router: Router,
		public facilityService: FacilitiesService) {
		this.facilityService.sliderAnnounced$.subscribe(value => {
			if (value === false) {
				this.addProduct = false;
				this.productCat = false;
				this.generic = false;
				this.productRoute = false;
				this.manufacturer = false;
				this.presentation = false;
			}

		})
	}

	ngOnInit() {
		let page: string = this._router.url;
		this.checkPageUrl(page);
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});

	}

	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}

	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
		}
	}

	onClickProductNavMenu() {
		this.facilityService.announceSlider(false);
		this.productNavMenu = true;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickCategoryNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = true;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickSupplierNavMenu() {
		//this.facilityService.announceSlider(false);
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = true;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickManufacturerNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = true;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickRouteNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = true;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickGenericNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = true;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickPresentationNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = true;
		this.strengthNavMenu  = false;
		this._productEventEmitter.announcedUrl.subscribe(url => {
            this.pageInView = url;
        });
	}
  
	onClickStrengthNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = true;
		this._productEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	private checkPageUrl(param: string) {
		if (param.includes('products')) {
			this.productNavMenu = true;
		} else if (param.includes('categories')) {
			this.categoryNavMenu = true;
		} else if (param.includes('suppliers')) {
			this.supplierNavMenu = true;
		} else if (param.includes('manufacturers')) {
			this.manufacturerNavMenu = true;
		} else if (param.includes('routes')) {
			this.routeNavMenu = true;
		} else if (param.includes('generics')) {
			this.genericNavMenu = true;
		} else if (param.includes('presentations')) {
			this.presentationNavMenu = true;
		}
	}
	productCatSlide(){
		this.addProduct = false;
		this.productCat = true;
		this.generic = false;
		this.productRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = true;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
	}
	genericSlide() {
		this.addProduct = false;
		this.productCat = false;
		this.generic = true;
		this.productRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = true;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
	}
	presentationSlide() {
		this.addProduct = false;
		this.productCat = false;
		this.generic = false;
		this.productRoute = false;
		this.manufacturer = false;
		this.presentation = true;
		this.strength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = true;
		this.strengthNavMenu  = false;
	}
	routeSlide() {
		this.addProduct = false;
		this.productCat = false;
		this.generic = false;
		this.productRoute = true;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = true;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
	}
	manufacturerSlide() {
		this.addProduct = false;
		this.productCat = false;
		this.generic = false;
		this.productRoute = false;
		this.manufacturer = true;
		this.presentation = false;
		this.strength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = true;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = false;
	}

	strengthSlide() {
		this.addProduct = false;
		this.productCat = false;
		this.generic = false;
		this.productRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = true;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu  = true;
	}

}
