import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
import {EmployeeService, InventoryService, StoreService} from "../../../../../services/facility-manager/setup";
import {ProductGridModel} from "../helper-components/ProductGridModel";
import {Subscription} from "rxjs";
import {AuthFacadeService} from "../../../../service-facade/auth-facade.service";

@Component({
    selector: 'app-outbound-requisition',
    templateUrl: './outbound-requisition.component.html',
    styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

    check: FormControl = new FormControl();
    storeLocation: FormControl = new FormControl();
    storeName: FormControl = new FormControl();
    private subscription$ : Subscription;
    mainStore : any ={};
    data : ProductGridModel[] = [];
    
    locations: any[] = [];// we have to cache all stores in the selected location so that we don't hit the server for every selection
    stores: any[] = []; // we have to cache all products in the selected store for reuse
    activeStoreObj: any = null;
    activeLocationObj: any = null;

    constructor(private locService: ReportGeneratorService,
                private storeService: StoreService,
                private employeeService: EmployeeService,
                private authFacadeService : AuthFacadeService
    ) {
        
        
    }

    ngOnInit() {
        this.getCurrentStoreInfoFromAuthenticatedUser();
        this.getCurrentAuthenticatedUser();
        this.getLocations();
        /*this.data   = [
            {
                _id  : _.uniqueId("000-0"),
                availableQuantity : 100,
                unitOfMeasure : "tablet",
                productId  :"0001",
                productName  : "Oral Tablet [Vaginyl]",
                price : 40.00,
                qtyOnHold  : 30,
                reorderLevel:10,
                size : 1,
                totalQuantity : 130,
                qtyToSend : 30
            },
            {
                _id  : _.uniqueId("000-1"),
                availableQuantity : 60,
                unitOfMeasure : "Capsules",
                productId  :"0002",
                productName  : "Amozyl Capsule",
                price : 240.00,
                qtyOnHold  : 10,
                reorderLevel:10,
                size : 1,
                totalQuantity : 70,
                qtyToSend : 5
            },
        ];*/
        
    }
    
    getCurrentStoreInfoFromAuthenticatedUser()
    {
        this.subscription$ = this.employeeService.checkInAnnounced$.subscribe((res) => {
            console.log(res , "Result from Store Stream")
            if (!!res) {
                if (!!res.typeObject) {
                    this.mainStore = res.typeObject;
                    console.log(this.mainStore, "Main Store!");
                    if (!!this.mainStore.storeId) {
                        // this.getSelectedStoreSummations();
                    }
                }
            }
        });
    }
    getCurrentAuthenticatedUser()
    {
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            console.log("Get Logged In Employee Payload" , payload);
            //this.loginEmployee = payload;
            /*this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
            const _id = (this.storeName.value === null) ? null : this.storeName.value;
            this.getSelectedStoreSummations()
            console.log(this.checkingStore);
            if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
                // this.modal_on = true;
            } else {
                let isOn = false;
                this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
                    if (itemr.isDefault === true) {
                        itemr.isOn = true;
                        itemr.lastLogin = new Date();
                        isOn = true;
                        let checkingObject = { typeObject: itemr, type: 'store' };
                        this._employeeService
                            .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
                            .then((payload) => {
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
                            this._employeeService
                                .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
                                .then((payload) => {
                                    this.loginEmployee = payload;
                                    const checkingObject = { typeObject: itemr, type: 'store' };
                                    this._employeeService.announceCheckIn(checkingObject);
                                    this._locker.setObject('checkingObject', checkingObject);
                                });
                        }
                    });
                }
            }*/
        });
    }
    
    
    
    getLocations() {
        this.locations = _.map(this.locService.getLocations(), x => {
            return {
                ...x,
                stores: []
            }

        });
        console.log(this.locations, "LOCATIONS");
    }

    getStoresInLocation() {
        const selectedLocId = (this.storeLocation.value);
        this.activeLocationObj = _.find(this.locations, {"id": selectedLocId});
        if (this.activeLocationObj.stores.length === 0)  // I included the check because the storeService does not filter by location at the moment
        {
            this.storeService.find({
                query: {
                    facilityId: this.locService.facilityId,
                    minorLocationId: selectedLocId
                }
            }).then(x => {

                const stores = _.map(x.data, s => {
                   
                    return {
                        storeName: s.name, storeId: s._id, description: s.description,
                        products: [], // products for this store will be cached here for reuse
                       
                    };
                });
               
                this.stores = stores;
            }, x => {
                console.log("There is an issue connecting with the server!", x);
            });
        }
        else {
            this.stores = this.activeLocationObj.stores || []; // set the stores to the selected location's stores property
        }

    }

    
}

/*
* Current Logged in employee Data structure
        consultingRoomCheckIn: (4) [{…}, {…}, {…}, {…}]
createdAt: "2018-05-16T07:57:38.735Z"
departmentId: "Medicine"
facilityId: "5af54ca6dbffe92c90559044"
isActive: true
minorLocationId: "General Out-Patient Clinic"
officialEmailAddress: ""
personDetails:
apmisId: "SO-6115"
createdAt: "2018-04-29T13:47:33.886Z"
dateOfBirth: "1989-04-28T23:00:00.000Z"
email: "sarcastic.stanley@gmail.com"
firstName: "George"
gender: "Male"
lastName: "Sylva"
motherMaidenName: "Philly "
nextOfKin: []
personProfessions: []
primaryContactPhoneNo: "08124664372"
profileImageObject: {encoding: "base64", mimetype: "image/jpeg", destination: "SO-6115/5ae5ccf5aee6293ef43618ed/profilePicture/5bcfe4b651588118d4cf1842.jpeg", filename: "5bcfe4b651588118d4cf1842.jpeg", path: "https://apmisstorageaccount.blob.core.windows.net/…18ed/profilePicture/5bcfe4b651588118d4cf1842.jpeg", …}
secondaryContactPhoneNo: []
securityAnswer: "Beans"
securityQuestion: "What was your favorite food as a child?"
title: "Mr."
updatedAt: "2018-11-02T11:02:31.800Z"
__v: 0
_id: "5ae5ccf5aee6293ef43618ed"
__proto__: Object
personId: "5ae5ccf5aee6293ef43618ed"
professionId: "Doctor"
storeCheckIn: Array(4)
0:
isDefault: false
isOn: true
lastLogin: "2018-12-11T08:59:36.446Z"
minorLocationId: "5afbe845dbffe92c90559112"
minorLocationObject:
name: "All Soul Pharmacy"
_id: "5afbe845dbffe92c90559112"
__proto__: Object
storeId: "5b0282ad3d853313d0cb3217"
storeObject:
canDespense: true
canReceivePurchaseOrder: true
createdAt: "2018-05-21T08:26:21.794Z"
description: "Central Store"
facilityId: "5af54ca6dbffe92c90559044"
minorLocationId: "5afbe845dbffe92c90559112"
name: "Central Store"
productTypeId: (2) [{…}, {…}]
store: []
updatedAt: "2018-05-31T22:59:00.048Z"
__v: 0
_id: "5b0282ad3d853313d0cb3217"
__proto__: Object
_id: "5b0283d13d853313d0cb3219"
__proto__: Object
1:
isDefault: false
isOn: false
lastLogin: "2018-05-22T06:34:23.939Z"
minorLocationId: "5afbe845dbffe92c90559112"
minorLocationObject: {name: "All Soul Pharmacy", _id: "5afbe845dbffe92c90559112"}
storeId: "5b0282ad3d853313d0cb3217"
storeObject: {name: "Central Store", _id: "5b0282ad3d853313d0cb3217"}
_id: "5b03bbba3d853313d0cb3237"
__proto__: Object
2:
isDefault: false
isOn: false
lastLogin: "2018-06-25T07:05:18.364Z"
minorLocationId: "5afbe845dbffe92c90559112"
minorLocationObject: {name: "All Soul Pharmacy", _id: "5afbe845dbffe92c90559112"}
storeId: "5b308c79030efe1ea0119086"
storeObject: {name: "GB-Store", _id: "5b308c79030efe1ea0119086"}
_id: "5b3094ea030efe1ea01190a0"
__proto__: Object
3:
isDefault: false
isOn: false
lastLogin: "2018-08-16T13:43:00.417Z"
minorLocationId: "5afbe845dbffe92c90559112"
minorLocationObject: {name: "All Soul Pharmacy", _id: "5afbe845dbffe92c90559112"}
storeId: "5b72edfa9a15fa293ca4c2ce"
storeObject: {name: "St Rapheal Store", _id: "5b72edfa9a15fa293ca4c2ce"}
_id: "5b75804e2a8f7034b42a447d"
__proto__: Object
length: 4
__proto__: Array(0)
units: ["General Out-Patient Clinic"]
updatedAt: "2018-12-11T08:59:36.582Z"
wardCheckIn: (28) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
workSpaces: (13) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
workbenchCheckIn: Array(2)
0:
isDefault: false
isOn: true
lastLogin: "2018-11-23T09:50:46.552Z"
minorLocationId: "5afbdfe9dbffe92c905590f5"
minorLocationObject: {createdAt: "2018-05-18T13:26:13.408Z", updatedAt: "2018-05-18T13:26:13.408Z", description: "", locationId: "59896b6bb3abed2f546bda58", name: "Microbiology", …}
workbenchId: "5afc4a2f5b9522384839840e"
workbenchObject:
createdAt: "2018-05-16T15:11:43.416Z"
facilityId: "5af54ca6dbffe92c90559044"
isActive: true
laboratoryId: "59896b6bb3abed2f546bda58"
minorLocationId: "5afbdfe9dbffe92c905590f5"
name: "Micro-Lab"
updatedAt: "2018-05-16T15:11:43.416Z"
__v: 0
_id: "5afc4a2f5b9522384839840e"
__proto__: Object
__proto__: Object
1:
isDefault: false
isOn: true
lastLogin: "2018-11-13T14:18:05.088Z"
minorLocationId: "5afbdfe9dbffe92c905590f5"
minorLocationObject: {description: "", locationId: "59896b6bb3abed2f546bda58", name: "Microbiology", _id: "5afbdfe9dbffe92c905590f5", isActive: true}
workbenchId: "5afc4a2f5b9522384839840e"
workbenchObject:
createdAt: "2018-05-16T15:11:43.416Z"
facilityId: "5af54ca6dbffe92c90559044"
isActive: true
laboratoryId: "59896b6bb3abed2f546bda58"
minorLocationId: "5afbdfe9dbffe92c905590f5"
name: "Micro-Lab"
updatedAt: "2018-05-16T15:11:43.416Z"
__v: 0
_id: "5afc4a2f5b9522384839840e"
__proto__: Object
__proto__: Object
length: 2
__proto__: Array(0)
__v: 0
_id: "5afbe472dbffe92c90559101"
__proto__: Object
* */