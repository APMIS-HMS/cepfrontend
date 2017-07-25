import { Component, OnInit, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility } from '../../../../models/index';
import {
    FacilitiesService, LaboratoryService
} from '../../../../services/facility-manager/setup/index';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-laboratory-lists',
  templateUrl: './laboratory-lists.component.html',
  styleUrls: ['./laboratory-lists.component.scss']
})
export class LaboratoryListsComponent implements OnInit {
  	facility: Facility = <Facility>{};
    laboratories: any = [];
    doctors: any = [];
	locations: any = [];
	loading: boolean = true;

	constructor(
		private _locker: CoolSessionStorage,
		private _laboratoryService: LaboratoryService
	) { }

	ngOnInit() {
		this._getLaboratories();
	}

  	private _getLaboratories() {
		  setTimeout(e => {
			this.laboratories = [{
				"fullname":"subair adams ohikere",
				"sex":"male",
				"doctor":"gordons",
				"date":"9-9-2009",
				"location":"subair adams ohikere",
				"diagnosis":"very diagnised",
				"samples":"sample taken",
				"isexternal":"yes",
				"payment":"paid",
			}];
		  }, 3000);
	  	// this._laboratoryService.find({ query: { facilityId: this.facility._id }})
		// 	.subscribe(res => {
		// 		this.loading = false;
		// 		console.log(res);
		// 	})
		// 	.error(err => {
		// 		console.log(err);
		// 	});
  	}

}
