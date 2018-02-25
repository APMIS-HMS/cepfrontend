import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BillingService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-hmo-bill-history-detail',
  templateUrl: './hmo-bill-history-detail.component.html',
  styleUrls: ['./hmo-bill-history-detail.component.scss']
})
export class HmoBillHistoryDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedFacility: any = <any>{}
  bills = []

  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
