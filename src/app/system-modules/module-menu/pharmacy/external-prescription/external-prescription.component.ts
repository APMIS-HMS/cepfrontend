import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../models/index';
import { PharmacyEmitterService } from '../../../../services/facility-manager/pharmacy-emitter.service';

@Component({
  selector: 'app-external-prescription',
  templateUrl: './external-prescription.component.html',
  styleUrls: ['./external-prescription.component.scss']
})
export class ExternalPrescriptionComponent implements OnInit {
  facility: Facility = <Facility>{};
	extPrescriptionFormGroup: FormGroup;
	extPrescriptions: any[] = [];
	tempExtPrescriptions: any[] = [];
	loading: boolean = true;
  
  constructor(
    private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService
  ) { }

  ngOnInit() {
    this._pharmacyEventEmitter.setRouteUrl('External Prescription List');
    this.facility = <Facility> this._locker.getObject('selectedFacility');

    this._getAllPrescriptions();
    
    this.extPrescriptionFormGroup = this._fb.group({
			search: [''],
			category: [''],
			date: [Date.now()]
    });
  }

  // Get all drugs from generic
	private _getAllPrescriptions() {
		this._prescriptionService.findAll().then(res => {
				console.log(res);
				this.loading = false;
				res.data.forEach(element => {
					if(element.isDispensed) {
						let isBilledCount = 0;
						let isExternalCount = 0;
						let preItemCount = element.prescriptionItems.length;
						element.prescriptionItems.forEach(preItem => {
							if(preItem.isBilled) {
								++isBilledCount;
              }
              
              if(preItem.isExternal) {
                ++isExternalCount;
              }
						});

						if(isBilledCount === preItemCount) {
							element.status = 'completely';
						} else if(isBilledCount === 0) {
							element.status = 'not';
						} else {
							element.status = 'partly';
            }
            
            // Check if there is any external item
            if(isExternalCount > 0) {
              this.tempExtPrescriptions.push(element);// temporary variable to search from.
              this.extPrescriptions.push(element);
            }
					}
				});
			}).catch(err => console.error(err));
	}
	onChangeCategory(e){
		
	}
}
