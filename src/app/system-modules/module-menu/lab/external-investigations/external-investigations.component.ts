import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FacilitiesService, LaboratoryRequestService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';

@Component({
  selector: 'app-external-investigations',
  templateUrl: './external-investigations.component.html',
  styleUrls: ['./external-investigations.component.scss']
})
export class ExternalInvestigationsComponent implements OnInit {
  extRequestFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  extRequests: any = [];
  loading: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
    private _laboratoryRequestService: LaboratoryRequestService
  ) { }

  ngOnInit() {
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    
    this.extRequestFormGroup = this._fb.group({
			search: [''],
			date: [Date.now()]
    });

    this._getAllRequests();
  }

  // Get all drugs from generic
	private _getAllRequests() {
		this._laboratoryRequestService.findAll().then(res => {
				console.log(res);
				this.loading = false;
				res.data.forEach(element => {
				
				});
			}).catch(err => console.error(err));
	}

}
