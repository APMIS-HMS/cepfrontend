import {Component, OnInit} from '@angular/core';
import {BillingService, FacilitiesService} from '../../../../services/facility-manager/setup/index';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {AuthFacadeService} from '../../../service-facade/auth-facade.service';
import {SystemModuleService} from 'app/services/module-manager/setup/system-module.service';
import {groupBy}  from  'lodash/groupBy';
import * as _ from 'lodash';

@Component({
    selector: 'app-hmo-officer',
    templateUrl: './hmo-officer.component.html',
    styleUrls: ['./hmo-officer.component.scss']
})
export class HmoOfficerComponent implements OnInit {

    billDetail_show = false;
    billHistoryDetail_show = false;
    hmoReport_show = false;
    tab1 = true;
    tab2 = false;
    selectedFacility: any = <any>{}
    selectedBill: any = <any>{}
    _selectedBill: any = <any>{}
    bills = []
    historyBills = []
    grandTotal: number = 0.0;

    constructor(private billingService: BillingService,
                private locker: CoolLocalStorage,
                private authFacadeService: AuthFacadeService,
                private systemModuleService: SystemModuleService,
                private facilitiesService: FacilitiesService
    ) {
    }

    ngOnInit() {
        this.selectedFacility = this.locker.getObject('selectedFacility');
        this.getBills();
    }

    getBills() {
        this.billingService.find({
            query: {
                isCoveredPage: true,
                facilityId: this.selectedFacility._id,
                'billItems.covered.coverType': 'insurance',
                $sort: {updatedAt: -1}
            }
        }).then(payload => {
            payload.data.forEach(element => {
                const index = element.billItems.filter(x => x.covered.isVerify !== undefined);
                if (index.length === 0) {
                    element.isPending = true;
                } else {
                    element.isPending = false;
                }
            });
            /* Perform grouping of billings based the HMO title
            * lodash utility library is use for the grouping
            * */
            this.bills = payload.data.filter(x => x.isPending === true);
            this.historyBills = payload.data.filter(x => x.isPending === false);
            this.calTotalBill();
            // console.log (_);
            // add som dummy data to the list and observer the grouping made
            const dummy  = _.take(this.historyBills,3);
            const joined  =  [..._.map(dummy, x => { x.coverFile.name  = "Modified HMO Name";
            return x;
            }), ...this.historyBills];

            let groupedData  =  _.groupBy(joined, function(obj)
            {
                return obj.coverFile.name;
            });
            //groupedData  = _.keys(groupedData);

            const newValue  = _.map(groupedData , (v,k) => {
                return {group: k,value : v};
            })
            //this.historyBills  = newValue;
            console.log("LOGGED",newValue[0].group,"END");
            console.log("NEW VALUE ",newValue);
        });
    }

    onRefreshBills(value) {
        this.getBills();
    }

    billDetail(bill) {
        this._selectedBill = bill;
        this.selectedBill = bill;
        this.billDetail_show = true;
    }

    billHistoryDetail(bill) {
        this.selectedBill = bill;
        this.billHistoryDetail_show = true;
    }

    hmo_report() {
        this.hmoReport_show = true;
    }

    close_onClick() {
        this.billDetail_show = false;
        this.billHistoryDetail_show = false;
        this.hmoReport_show = false;
    }

    tab1_click() {
        this.tab1 = true;
        this.tab2 = false;
    }

    tab2_click() {
        this.tab1 = false;
        this.tab2 = true;
    }

    private calTotalBill() {
        this.grandTotal = 0;
        this.historyBills.forEach(b => {
            this.grandTotal += b.grandTotal;
        });
    }
}
