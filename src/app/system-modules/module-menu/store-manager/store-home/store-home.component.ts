import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { InventoryService, ProductService, EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Inventory, Employee, User } from '../../../../models/index';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.scss']
})
export class StoreHomeComponent implements OnInit, OnDestroy {
  inventories: any[] = [];
  checkingStore: any = <any>{};
  inventoryLoading = true;
  modal_on = false;
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  workSpace: any;
  Ql_toggle = false;

  constructor(
    private _inventoryService: InventoryService,
    private _facilityService: FacilitiesService,
    private _productService: ProductService,
    private _locker: CoolLocalStorage,
    private _employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService
  ) {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    const auth: any = this._locker.getObject('auth');
    // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      if (this.checkingStore !== null) {
        this.getInventories();
      }
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
            this._employeeService.announceCheckIn(checkingObject);

            // tslint:disable-next-line:no-shadowed-variable
            this._employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
              this.loginEmployee = payload;
              checkingObject = { typeObject: itemr, type: 'store' };
              this._employeeService.announceCheckIn(checkingObject);
              this._locker.setObject('checkingObject', checkingObject);
            });
          }
        });
        if (isOn === false) {
          this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
            if (r === 0) {
              itemr.isOn = true;
              itemr.lastLogin = new Date();
              // tslint:disable-next-line:no-shadowed-variable
              this._employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
                this.loginEmployee = payload;
                const checkingObject = { typeObject: itemr, type: 'store' };
                this._employeeService.announceCheckIn(checkingObject);
                this._locker.setObject('checkingObject', checkingObject);
              });
            }

          });
        }

      }
    });
    // this.authFacadeService.getLogingEmployee().then((res: any) => {
    //   this.loginEmployee = res;
    //   this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
    //   if (this.checkingStore !== null) {
    //     this.getInventories();
    //   }
    // });

    this._employeeService.checkInAnnounced$.subscribe(res => {
      console.log(res);
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          if (!!this.checkingStore.storeId) {
            this.getInventories();
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  getInventories() {
    console.log(this.checkingStore);
    if (!!this.checkingStore) {
      console.log('Tell me where the love lie');
      this._inventoryService.findList({
        query: { facilityId: this.selectedFacility._id, name: '', storeId: this.checkingStore.storeId, $limit: 10 }
      }).then(res => {
        console.log(res);
        this.inventoryLoading = false;
        this.inventories = res.data.filter(x => x.totalQuantity > 0);
      });
    }
  }

  onChangeCheckedIn() {
    this.modal_on = true;
  }

  close_onClick(message: boolean): void {
    this.modal_on = false;
  }

  toggleQl() {
    this.Ql_toggle = !this.Ql_toggle;
  }

  ngOnDestroy() {
    if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this._employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
          });
        }
      });
    }
    this._employeeService.announceCheckIn(undefined);
    this._locker.setObject('checkingObject', {});
  }

}
