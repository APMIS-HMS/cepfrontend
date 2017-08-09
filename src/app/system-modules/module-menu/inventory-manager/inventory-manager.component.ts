import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryEmitterService } from '../../../services/facility-manager/inventory-emitter.service';
import { Employee, Facility } from '../../../models/index';
import { EmployeeService, WorkSpaceService } from '../../../services/facility-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.scss']
})
export class InventoryManagerComponent implements OnInit, OnDestroy {
  pageInView: String = '';
  inventoryNavMenu = false;
  stockTakingNavMenu = false;
  stockTransferNavMenu = false;
  receiveStockNavMenu = false;
  requisitionNavMenu = false;
  contentSecMenuShow = false;
  stockHistoryNavMenu = false;
  purchaseManagerNavMenu = false;
  modal_on = false;


  loginEmployee: Employee = <Employee>{};
  workSpace: any;
  selectedFacility: Facility = <Facility>{};
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private route: ActivatedRoute, private _router: Router, private employeeService: EmployeeService,
    private locker: CoolSessionStorage, private workSpaceService: WorkSpaceService) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    if ((this.loginEmployee.storeCheckIn === undefined
      || this.loginEmployee.storeCheckIn.length === 0)) {
      this.modal_on = true;
    } else {
      let isOn = false;
      this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true) {
          itemr.isOn = true;
          itemr.lastLogin = new Date();
          isOn = true;
          let checkingObject = { typeObject: itemr, type: 'store' };
          this.employeeService.announceCheckIn(checkingObject);
          console.log(checkingObject)
          this.locker.setObject('checkingObject', checkingObject);
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
    //           this.employeeService.update(this.loginEmployee).then(payload => {
    //             this.loginEmployee = payload;
    //             checkingObject = { typeObject: itemr, type: 'store' };
    //             this.employeeService.announceCheckIn(checkingObject);
    //             console.log(1)
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
    //               console.log(2)
    //               console.log(checkingObject);
    //               this.locker.setObject('checkingObject', checkingObject);
    //             });
    //           }

    //         });
    //       }

    //     }
    //   });






    const page: string = this._router.url;
    this.checkPageUrl(page);
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  close_onClick(message: boolean): void {
    this.modal_on = false;
  }
  onChangeCheckedIn(hide) {
    this.modal_on = true;
    this.contentSecMenuShow = false;
  
  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }

  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }

  onClickInventoryNavMenu() {
    this.inventoryNavMenu = true;
    this.stockTakingNavMenu = false;
    this.stockHistoryNavMenu = false;
    this.stockTransferNavMenu = false;
    this.receiveStockNavMenu = false;
    this.requisitionNavMenu = false;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  onClickStockTakingNavMenu() {
    this.inventoryNavMenu = false;
    this.stockTakingNavMenu = true;
    this.stockHistoryNavMenu = false;
    this.stockTransferNavMenu = false;
    this.receiveStockNavMenu = false;
    this.requisitionNavMenu = false;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  onClickStockTransferNavMenu() {
    this.inventoryNavMenu = false;
    this.stockTakingNavMenu = false;
    this.stockHistoryNavMenu = false;
    this.stockTransferNavMenu = true;
    this.receiveStockNavMenu = false;
    this.requisitionNavMenu = false;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }
  onClickStockHistoryNavMenu() {
    this.inventoryNavMenu = false;
    this.stockTakingNavMenu = false;
    this.stockTransferNavMenu = false;
    this.stockHistoryNavMenu = true;
    this.receiveStockNavMenu = false;
    this.requisitionNavMenu = false;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  onClickReceiveStockNavMenu() {
    this.inventoryNavMenu = false;
    this.stockTakingNavMenu = false;
    this.stockTransferNavMenu = false;
    this.receiveStockNavMenu = true;
    this.requisitionNavMenu = false;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  onClickRequisitionNavMenu() {
    this.inventoryNavMenu = false;
    this.stockTakingNavMenu = false;
    this.stockTransferNavMenu = false;
    this.receiveStockNavMenu = false;
    this.requisitionNavMenu = true;
    this._inventoryEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }


  private checkPageUrl(param: string) {
    if (param.includes('inventory')) {
      this.inventoryNavMenu = true;
    } else if (param.includes('stock-taking')) {
      this.stockTakingNavMenu = true;
    } else if (param.includes('stock-transfer')) {
      this.stockTransferNavMenu = true;
    } else if (param.includes('receive-stock')) {
      this.receiveStockNavMenu = true;
    } else if (param.includes('requisition')) {
      this.requisitionNavMenu = true;
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
  pageInViewLoader(e) {

  }
}
