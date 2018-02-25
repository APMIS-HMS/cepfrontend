import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormControl } from '@angular/forms';
import { BillingService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-hmo-bill-detail',
  templateUrl: './hmo-bill-detail.component.html',
  styleUrls: ['./hmo-bill-detail.component.scss']
})
export class HmoBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBill;

  authCode_show = false;
  hmoPaymentType = [];
  hmoTypeControl: FormControl = new FormControl();
  authCodeControl: FormControl = new FormControl();

  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.hmoPaymentType = [{
      name: 'Capitation',
      id: 0
    }, {
      name: 'Fee For Service',
      id: 1
    }];
    console.log(this.selectedBill);
    this.hmoTypeControl.valueChanges.subscribe(value => {
      if (value === 0) {
        this.authCode_show = false;
      } else if (value === 1) {
        this.authCode_show = true;
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  newWorkspace_onClick() { }
  // deletion_popup() {}

}
