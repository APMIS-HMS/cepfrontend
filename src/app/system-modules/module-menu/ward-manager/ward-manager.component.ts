import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WardEmitterService } from '../../../services/facility-manager/ward-emitter.service';

@Component({
	selector: 'app-ward-manager',
	templateUrl: './ward-manager.component.html',
	styleUrls: ['./ward-manager.component.scss']
})
export class WardManagerComponent implements OnInit {
	pageInView: string;

	admissionNavMenu = false;
	admittedNavMenu = false;
	wardNavMenu = false;
	setupNavMenu = false;
	transferNavMenu = false;
	contentSecMenuShow = false;

	searchControl = new FormControl();

	constructor(private _wardEventEmitter: WardEmitterService, private _router: Router) {

	}

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	onClickAdmissionNavMenu() {
		this.admissionNavMenu = true;
		this.admittedNavMenu = false;
		this.wardNavMenu = false;
		this.setupNavMenu = false;
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});

	}

	onClickAdmittedNavMenu() {
		this.admissionNavMenu = false;
		this.admittedNavMenu = true;
		this.wardNavMenu = false;
		this.setupNavMenu = false;
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickSetupNavMenu() {
		this.admissionNavMenu = false;
		this.admittedNavMenu = false;
		this.setupNavMenu = true;
		this.wardNavMenu = false;
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	onClickWardNavMenu() {
		this.admissionNavMenu = false;
		this.admittedNavMenu = false;
		this.setupNavMenu = false;
		this.wardNavMenu = true;
		this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	private checkPageUrl(param: string) {
		if (param.includes('admission')) {
			this.admissionNavMenu = true;
		} else if (param.includes('admitted')) {
			this.admittedNavMenu = true;
		} else if (param.includes('setup')) {
			this.setupNavMenu = true;
		} else if (param.includes('wards')) {
			this.wardNavMenu = true;
		}
	}

}
