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
    serverData = [];
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
                        qtyDetails: [{totalQuantity: x.totalQuantity, 
                            qtyOnHold: x.qtyOnHold,
                            availableQuantity : x.availableQuantity
                        }],
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

    buildProductGridDataFromServerResponse(serverModel: any[]): ProductGridModel[] {
       
       const res: any[]  =  _.map(serverModel, (x, index) =>{
            const viewData : any = {
                createdAt  : x.createdAt,
                comment : x.comment,
                storeId : x.storeId,
                destinationStoreId : x.destinationStoreId,
                destinationStoreName : x.destinationStoreObject.name,
                storeRequisitionNumber : x.storeRequisitionNumber,
                facilityId: x.facilityId,
                isSupplied: x.isSupplied,
                minorLocationId : x.minorLocationId,
                description: x.description,
                _id : x._id,
                employeeId : x.employeeId,
                items : _.map(x.products, i => {
                    return {
                        availableQuantity :i.qtyDetails[0].availableQuantity || i.qtyDetails[0].totalQuantity ,
                        totalQuantity : i.qtyDetails[0].totalQuantity,
                        qtyOnHold : i.qtyDetails[0].qtyOnHold,
                        productObject : i.productObject,
                        unitOfMeasure : i.productObject.productConfiguration.name,
                        productId : i.productObject.productId,
                        productName : i.productObject.productName,
                        productCode : i.productObject.productCode,
                        price : i.productObject.price,
                        qtyToSend : i.qty,
                        isNew:false,
                        isAccepted : i.isAccepted || false,
                        productConfiguration: i.productObject.productConfiguration
                        
                        
                    }
                })
                
            };
          return viewData;
        });
      
        return res;
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
            
                this.isLoadingFromServer = false;
                if (x.data.length > 0) {
                    this.serverData  = this.buildProductGridDataFromServerResponse(x.data);
                }
            }, x => {
                this.isLoadingFromServer = false;
                console.log("Could not complete operation on the server", x);
            })
    }


}
