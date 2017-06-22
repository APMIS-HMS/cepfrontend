import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService } from '../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-pharmacy-manager',
	templateUrl: './pharmacy-manager.component.html',
	styleUrls: ['./pharmacy-manager.component.scss']
})

export class PharmacyManagerComponent implements OnInit {
	pageInView: String = '';
	pharmacyNavMenu = false;
	categoryNavMenu = false;
	supplierNavMenu = false;
	manufacturerNavMenu = false;
	routeNavMenu = false;
	genericNavMenu = false;
	presentationNavMenu = false;
	strengthNavMenu = false;
	contentSecMenuShow = false;

	// pharmacys page
	addPharmacy = false;
	pharmacyCat = false;
	generic = false;
	pharmacyRoute = false;
	manufacturer = false;
	presentation = false;
	strength = false;
	productCat = false;
	productNavMenu = false;

	productRoute = false;

	constructor(private _pharmacyEventEmitter: PharmacyEmitterService, private _router: Router,
		public facilityService: FacilitiesService) {
		this.facilityService.sliderAnnounced$.subscribe(value => {
			if (value === false) {
				this.addPharmacy = false;
				this.pharmacyCat = false;
				this.generic = false;
				this.pharmacyRoute = false;
				this.manufacturer = false;
				this.presentation = false;
			}

		})
	}

	ngOnInit() {
		let page: string = this._router.url;
		this.checkPageUrl(page);
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
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

	onClickPharmacyNavMenu() {
		this.facilityService.announceSlider(false);
		this.pharmacyNavMenu = true;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickCategoryNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = true;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickSupplierNavMenu() {
		// this.facilityService.announceSlider(false);
		this.categoryNavMenu = false;
		this.supplierNavMenu = true;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickManufacturerNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = true;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickRouteNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = true;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickGenericNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = true;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickPresentationNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = true;
		this.strengthNavMenu = false;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickStrengthNavMenu() {
		this.pharmacyNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = true;
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	private checkPageUrl(param: string) {
		if (param.includes('pharmacys')) {
			this.pharmacyNavMenu = true;
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
	pharmacyCatSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = true;
		this.generic = false;
		this.pharmacyRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
	}
	genericSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = false;
		this.generic = true;
		this.pharmacyRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
	}
	presentationSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = false;
		this.generic = false;
		this.pharmacyRoute = false;
		this.manufacturer = false;
		this.presentation = true;
		this.strength = false;
	}
	routeSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = false;
		this.generic = false;
		this.pharmacyRoute = true;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = false;
	}
	manufacturerSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = false;
		this.generic = false;
		this.pharmacyRoute = false;
		this.manufacturer = true;
		this.presentation = false;
		this.strength = false;
	}

	strengthSlide() {
		this.addPharmacy = false;
		this.pharmacyCat = false;
		this.generic = false;
		this.pharmacyRoute = false;
		this.manufacturer = false;
		this.presentation = false;
		this.strength = true;
	}

}
