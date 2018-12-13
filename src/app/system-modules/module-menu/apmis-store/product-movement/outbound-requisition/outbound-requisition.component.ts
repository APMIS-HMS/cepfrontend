import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
import {EmployeeService, InventoryService, StoreService} from "../../../../../services/facility-manager/setup";
import {ProductGridModel, StoreOutboundModel} from "../helper-components/ProductGridModel";
import {Subscription} from "rxjs";
import {AuthFacadeService} from "../../../../service-facade/auth-facade.service";
import {Employee} from "../../../../../models";
import {ProductGridComponent} from "../helper-components/products/product-grid-component";
import {SystemModuleService} from "../../../../../services/module-manager/setup/system-module.service";
import {StoreOutboundService} from "../../../../../services/facility-manager/setup/store-outbound-requisitory-service";

@Component({
    selector: 'app-outbound-requisition',
    templateUrl: './outbound-requisition.component.html',
    styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

    check: FormControl = new FormControl();
    storeLocation: FormControl = new FormControl();
    storeName: FormControl = new FormControl();
    private subscription$: Subscription;
    mainStore: any = {};
    data: ProductGridModel[] = [];
    dataFromServer: ProductGridModel[] = [];
    isLoadingFromServer: boolean = false;
    selectedProductItems: any[] = [];
    locations: any[] = [];// we have to cache all stores in the selected location so that we don't hit the server for every selection
    stores: any[] = []; // we have to cache all products in the selected store for reuse

    activeLocationObj: any = null;
    processing: boolean = false;
    saving: boolean = false;
    loginEmployee: Employee = null;

    @ViewChild("grid") grid: ProductGridComponent;

    constructor(private locService: ReportGeneratorService,
                private storeService: StoreService,
                private employeeService: EmployeeService,
                private authFacadeService: AuthFacadeService,
                private systemService: SystemModuleService,
                private storeOutboundService: StoreOutboundService
    ) {
        this.getCurrentStoreInfoFromAuthenticatedUser();
        this.getCurrentAuthenticatedUser();

    }

    ngOnInit() {

        this.getLocations();
    }

    getCurrentStoreInfoFromAuthenticatedUser() {
        /*this.subscription$ = this.employeeService.checkInAnnounced$.subscribe((res) => {
           
            if (!!res) {
                if (!!res.typeObject) {
                    this.mainStore = res.typeObject;
                    //console.log(this.mainStore, "Main Store!");
                    if (!!this.mainStore.storeId) {
                        // this.getSelectedStoreSummations();
                    }
                }
            }
            //console.log(this.mainStore , "Result for Main Store")
        });*/
    }

    getCurrentAuthenticatedUser() {
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            //console.log("Get Logged In Employee Payload", payload);
            this.loginEmployee = payload;
            // get the current active store from the checkinStore property
            this.mainStore = this.loginEmployee.storeCheckIn.find(x => x.isOn == true)

        });
    }


    getLocations() {
        this.locations = _.map(this.locService.getLocations(), x => {
            return {
                ...x,
                stores: []
            }

        });
        //console.log(this.locations, "LOCATIONS");
    }

    getStoresInLocation() {
        const selectedLocId = (this.storeLocation.value);
        this.activeLocationObj = _.find(this.locations, {"id": selectedLocId});
        if (this.activeLocationObj.stores.length === 0)  // I included the check because the storeService does not filter by location at the moment
        {
            this.processing = true;
            this.storeService.find({
                query: {
                    facilityId: this.locService.facilityId,
                    minorLocationId: selectedLocId
                }
            }).then(x => {
                this.processing = false;
                const stores = _.map(x.data, s => {

                    return {
                        storeName: s.name, storeId: s._id, description: s.description,
                        products: [], // products for this store will be cached here for reuse

                    };
                });

                this.stores = stores;
            }, x => {
                this.processing = false;
                //console.log("There is an issue connecting with the server!", x);
            });
        }
        else {
            this.stores = this.activeLocationObj.stores || []; // set the stores to the selected location's stores property
        }

    }

    sendSelectedItems() {
        // log the selected items from the Product Grid Component
        const selectedItems: ProductGridModel[] = this.grid.getSelectedItems();
        //console.log(selectedItems);
        this.buildOutboundData(selectedItems);
    }

    buildOutboundData(selectedItems: ProductGridModel[]) {
        if (selectedItems.length > 0) {
            // Build
            const result: StoreOutboundModel = {
                facilityId: this.locService.facilityId,
                storeId: this.mainStore._id,
                employeeId: this.loginEmployee._id,
                destinationStoreId: this.storeName.value,
                comment: 'OUTBOUND-REQ',
                isSupplied: false,
                products: selectedItems.map(x => {
                    return {
                        isAccepted: false,
                        productId: x.productId,
                        qty: x.qtyToSend,
                        qtyDetails: {totalQuantity: x.totalQuantity, qtyOnHold: x.qtyOnHold},
                        productObject:
                            {
                                price: x.price,
                                productName: x.productName,
                                productId: x._id,
                                productCode: x.productCode,
                                productConfiguration: x.productConfiguration
                            }

                    };

                })
            }

            // Log the result
            this.saving = true;
            this.storeOutboundService.create(result)
                .then(x => {
                    //console.log(x);
                    this.saving = false;
                    // clear all entries
                    this.data = [];
                    this.systemService.announceSweetProxy("Outbound Requisition Created with Ref No: " +
                        x.storeRequisitionNumber + ". ", "success");
                }, x => {
                    this.saving = false;
                    //console.log(x);
                })
        }
        else {
            // inform user to select at least on item and try again
            this.systemService.announceSweetProxy("Please select at least one item from" +
                " the list, or add a new item", "error");
        }
    }

    buildProductGridDataFromServerResponse(serverModel: StoreOutboundModel[]): ProductGridModel[] {
        /*
    comment: "OUTBOUND-REQ"
    createdAt: "2018-12-13T03:13:10.079Z"
    destinationStoreId: "5b0282ad3d853313d0cb3217"
    destinationStoreObject: {_id: "5b0282ad3d853313d0cb3217", updatedAt: "2018-05-31T22:59:00.048Z", createdAt: "2018-05-21T08:26:21.794Z", name: "Central Store", minorLocationId: "5afbe845dbffe92c90559112", …}
    employeeId: "5afbe472dbffe92c90559101"
    employeeObject: {_id: "5afbe472dbffe92c90559101", updatedAt: "2018-12-13T10:42:41.573Z", createdAt: "2018-05-16T07:57:38.735Z", facilityId: "5af54ca6dbffe92c90559044", departmentId: "Medicine", …}
    facilityId: "5af54ca6dbffe92c90559044"
    isSupplied: false
    products: Array(4)
    0: {productId: "5abc02a5c8ac61402697488f", qty: 400, productObject: {…}, _id: "5c11ce4632295b6821ceea2f", updatedAt: "2018-12-13T03:13:10.077Z", …}
    1: {productId: "5abc02a4c8ac614026971560", qty: 1000, productObject: {…}, _id: "5c11ce4632295b6821ceea2e", updatedAt: "2018-12-13T03:13:10.076Z", …}
    2: {productId: "5b6315b1b9ed40022cd4f968", qty: 320, productObject: {…}, _id: "5c11ce4632295b6821ceea2d", updatedAt: "2018-12-13T03:13:10.076Z", …}
    3: {productId: "5abc02a5c8ac6140269744c7", qty: 400, productObject: {…}, _id: "5c11ce4632295b6821ceea2c", updatedAt: "2018-12-13T03:13:10.075Z", …}
    length: 4
    __proto__: Array(0)
    storeId: "5b0283d13d853313d0cb3219"
    storeRequisitionNumber: "RQ9401843QK"
    updatedAt: "2018-12-13T03:13:10.079Z"
    __v: 0
    _id: "5c11ce4632295b6821ceea2b"
     */
       const res: any[]  =  _.map(serverModel, (x, index) =>{
            const viewData : any = {
                createdAt  : x.createdAt,
                comment : x.comment,
                storeId : x.storeId,
                destinationStoreId : x.destinationStoreId,
                storeRequisitionNumber : x.storeRequisitionNumber,
                id : x._id,
                employeeId : x.employeeId,
                items : _.map(x.products, i => {
                    return {
                        //availableQuantity : i.
                    }
                })
                
            }
            const m :ProductGridModel = {
                
            }
        })
        return [];
    }

    getStoreOutboundFromServer() {
        //TODO Add Pagination Logic

        this.isLoadingFromServer = true;
        this.storeOutboundService.find({
            query: {
                comment: "OUTBOUND-REQ",
                facilityId: this.locService.facilityId,
                destinationStoreId: this.storeName.value,
                storeId: this.mainStore._id
            }
        })
            .then(x => {
                console.log(x.data, x, "Record from Server");
                this.isLoadingFromServer = false;
                if (x.data.length > 0) {

                }
            }, x => {
                this.isLoadingFromServer = false;
                console.log("Could not complete operation on the server", x);
            })
    }


}
