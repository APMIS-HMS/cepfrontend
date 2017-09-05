import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseEmitterService } from '../../../services/facility-manager/purchase-emitter.service';
import { Employee, Facility } from '../../../models/index';
import { EmployeeService, WorkSpaceService } from '../../../services/facility-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-purchase-manager',
  templateUrl: './purchase-manager.component.html',
  styleUrls: ['./purchase-manager.component.scss']
})
export class PurchaseManagerComponent implements OnInit, OnDestroy {
  pageInView: String = '';
  pageInView_subTitle: String = '';
  purchaseHistoryNavMenu = false;
  purchaseOrderNavMenu = false;
  invoicesNavMenu = false;
  contentSecMenuShow = false;
  newpurchaseNavMenu = false;
  purchaseEntryNavMenu = false;
  supplierNavMenu = false;
  modal_on = false;
  closeWhenClick = true;

  loginEmployee: Employee = <Employee>{};
  workSpace: any;
  selectedFacility: Facility = <Facility>{};
  constructor(
    private _purchaseEventEmitter: PurchaseEmitterService, private route: ActivatedRoute,
    private _router: Router, private employeeService: EmployeeService,
    private locker: CoolSessionStorage, private workSpaceService: WorkSpaceService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    console.log(this.loginEmployee);

    if ((this.loginEmployee.storeCheckIn === undefined
      || this.loginEmployee.storeCheckIn.length === 0)) {
      console.log('is true')
      this.modal_on = true;
    } else {
      console.log('is false')
      let isOn = false;
      this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true) {
          itemr.isOn = true;
          itemr.lastLogin = new Date();
          isOn = true;
          let checkingObject = { typeObject: itemr, type: 'store' };
          this.employeeService.announceCheckIn(checkingObject);
          console.log(checkingObject)

          console.log('sent');
          this.employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
            checkingObject = { typeObject: itemr, type: 'store' };
            this.employeeService.announceCheckIn(checkingObject);
            this.locker.setObject('checkingObject', checkingObject);
          });
        }
      });
      if (isOn === false) {
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (r === 0) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            this.employeeService.update(this.loginEmployee).then(payload => {
              this.loginEmployee = payload;
              const checkingObject = { typeObject: itemr, type: 'store' };
              this.employeeService.announceCheckIn(checkingObject);
              this.locker.setObject('checkingObject', checkingObject);
            });
          }

        });
      }

    }

  }

  ngOnInit() {




    // const emp$ = Observable.fromPromise(this.employeeService.find({
    //   query: {
    //     facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
    //   }
    // }));
    // emp$.mergeMap((emp: any) => Observable.forkJoin([
    //   Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
    //   Observable.fromPromise(this.workSpaceService.find({ query: { employeeId: emp.data[0]._id } }))
    // ]))
    //   .subscribe((results: any) => {
    //     if (results[1].data.length > 0) {
    //       this.workSpace = results[1].data[0];
    //     }

    //     this.loginEmployee = results[0];
    //     console.log(this.loginEmployee);
    //     if ((this.loginEmployee.storeCheckIn === undefined
    //       || this.loginEmployee.storeCheckIn.length === 0)) {
    //       this.modal_on = true;
    //     } else {
    //       let isOn = false;
    //       this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
    //         if (itemr.isDefault === true) {
    //           itemr.isOn = true;
    //           itemr.lastLogin = new Date();
    //           isOn = true;
    //           let checkingObject = { typeObject: itemr, type: 'store' };
    //           this.employeeService.announceCheckIn(checkingObject);
    //           console.log('sent');
    //           this.employeeService.update(this.loginEmployee).then(payload => {
    //             this.loginEmployee = payload;
    //             checkingObject = { typeObject: itemr, type: 'store' };
    //             this.employeeService.announceCheckIn(checkingObject);
    //             this.locker.setObject('checkingObject', checkingObject);
    //           });
    //         }
    //       });
    //       if (isOn === false) {
    //         this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
    //           if (r === 0) {
    //             itemr.isOn = true;
    //             itemr.lastLogin = new Date();
    //             this.employeeService.update(this.loginEmployee).then(payload => {
    //               this.loginEmployee = payload;
    //               const checkingObject = { typeObject: itemr, type: 'store' };
    //               this.employeeService.announceCheckIn(checkingObject);
    //               this.locker.setObject('checkingObject', checkingObject);
    //             });
    //           }

    //         });
    //       }

    //     }

    //   }, error => {
    //     console.log(error);
    //   });
    const page: string = this._router.url;
    this.checkPageUrl(page);
    this._purchaseEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });


  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }

  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }

  onClickPurchaseHistoryNavMenu() {
    this.purchaseHistoryNavMenu = true;
    this.purchaseOrderNavMenu = false;
    this.invoicesNavMenu = false;
    this.purchaseEntryNavMenu = false;
    this._purchaseEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  onClickPurchaseOrderNavMenu() {
    this.purchaseHistoryNavMenu = true;
    this.purchaseOrderNavMenu = false;
    this.purchaseEntryNavMenu = false;
    this.invoicesNavMenu = false;
    this._purchaseEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }
  onChangeCheckedIn() {
    this.modal_on = true;
    this.closeWhenClick = false;
    this.contentSecMenuShow = false;
  }
  onClickInvoicesNavMenu() {
    this.purchaseHistoryNavMenu = true;
    this.purchaseOrderNavMenu = false;
    this.invoicesNavMenu = false;
    this.purchaseEntryNavMenu = false;
    this._purchaseEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }
  onClicknewpurchaseNavMenu() {
    this.purchaseEntryNavMenu = false;
    this.newpurchaseNavMenu = true;
    this.purchaseHistoryNavMenu = false;
    this.purchaseOrderNavMenu = false;
    this.invoicesNavMenu = false;
    this.pageInView = 'Purchase Order'
    this.pageInView_subTitle = 'Purchase Manager'
  }

  onClickPurchaseEntryNavMenu() {
    this.purchaseEntryNavMenu = true;
    this.newpurchaseNavMenu = false;
    this.purchaseHistoryNavMenu = false;
    this.purchaseOrderNavMenu = false;
    this.invoicesNavMenu = false;
    this.pageInView = 'Purchase Entry';
    this.pageInView_subTitle = 'Purchase Manager';
  }

  pageInViewLoader(title) {
    this.pageInView = title;
  }

  changeRoute(val) {
    console.log(val);
    if (val == '') {
      this.purchaseHistoryNavMenu = false;
      this.purchaseOrderNavMenu = true;
      this.purchaseEntryNavMenu = false;
      this.invoicesNavMenu = false;
      this._purchaseEventEmitter.announcedUrl.subscribe(url => {
        this.pageInView = url;
      });
    } else if (val == 'histories') {
      this.purchaseHistoryNavMenu = true;
      this.purchaseOrderNavMenu = false;
      this.invoicesNavMenu = false;
      this.purchaseEntryNavMenu = false;
      this._purchaseEventEmitter.announcedUrl.subscribe(url => {
        this.pageInView = url;
      });
    } else if (val == 'invoices') {
      this.purchaseHistoryNavMenu = false;
      this.purchaseOrderNavMenu = false;
      this.invoicesNavMenu = true;
      this.purchaseEntryNavMenu = false;
      this._purchaseEventEmitter.announcedUrl.subscribe(url => {
        this.pageInView = url;
      });
    } else if (val == 'purchase-entry') {
      this.purchaseEntryNavMenu = true;
      this.newpurchaseNavMenu = false;
      this.purchaseHistoryNavMenu = false;
      this.purchaseOrderNavMenu = false;
      this.invoicesNavMenu = false;
      this.pageInView = 'Purchase Entry';
      this.pageInView_subTitle = 'Purchase Manager';
    }
  }

  private checkPageUrl(param: string) {
    if (param.includes('histories')) {
      this.purchaseHistoryNavMenu = true;
    } else if (param.includes('orders')) {
      this.purchaseOrderNavMenu = true;
    } else if (param.includes('invoices')) {
      this.invoicesNavMenu = true;
    }

    if (param.includes('new-order')) {
      this.newpurchaseNavMenu = true;
      this.purchaseEntryNavMenu = false;
      this.purchaseHistoryNavMenu = false;
      this.purchaseOrderNavMenu = false;
      this.invoicesNavMenu = false;
      this.contentSecMenuShow = false;
      this.pageInView = 'Purchase Order';
      this.pageInView_subTitle = 'Purchase Manager';
    } else if (param.includes('purchase-entry')) {
      this.purchaseEntryNavMenu = true;
      this.purchaseHistoryNavMenu = false;
      this.purchaseOrderNavMenu = false;
      this.invoicesNavMenu = false;
      this.contentSecMenuShow = false;
      this.newpurchaseNavMenu = false;
      this.pageInView = 'Purchase Entry';
      this.pageInView_subTitle = 'Purchase Manager';
    }
  }
  ngOnDestroy() {
    if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this.employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
          });
        }
      });
    }
    this.employeeService.announceCheckIn(undefined);
    this.locker.setObject('checkingObject', {});
  }
}
