import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Employee} from "../../../../../models";
import {ProductGridModel, StoreOutboundModel} from "../helper-components/ProductGridModel";
import {IPagerSource} from "../../../../../core-ui-modules/ui-components/PagerComponent";
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import {StoreOutboundService} from "../../../../../services/facility-manager/setup/store-outbound-requisitory-service";
import {SystemModuleService} from "../../../../../services/module-manager/setup/system-module.service";
import {AuthFacadeService} from "../../../../service-facade/auth-facade.service";
import {EmployeeService, StoreService} from "../../../../../services/facility-manager/setup";
import * as _ from 'lodash';
@Component({
  selector: 'app-inbound-requisition',
  templateUrl: './inbound-requisition.component.html',
  styleUrls: ['./inbound-requisition.component.scss'],
    encapsulation : ViewEncapsulation.None
})
export class InboundRequisitionComponent implements OnInit {

  check:FormControl = new FormControl();
    serverData = [];
    isLoadingFromServer: boolean = false; 
    processing: boolean = false;
    saving: boolean = false;
    loginEmployee: Employee = null; 
    mainStore: any = {};
    pagerSource : IPagerSource = {
        totalRecord : 0 ,
        pageSize : 10,
        currentPage : 0,
        totalPages : 0
    }
  constructor(private locService: ReportGeneratorService,
              private storeService: StoreService,
              private employeeService: EmployeeService,
              private authFacadeService: AuthFacadeService,
              private systemService: SystemModuleService,
              private storeOutboundService: StoreOutboundService) {

      this.getCurrentAuthenticatedUser();
  } 

  ngOnInit() {
    this.getStoreOutboundFromServer();
  }
    getCurrentAuthenticatedUser() {
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            //console.log("Get Logged In Employee Payload", payload);
            this.loginEmployee = payload;
            // get the current active store from the checkinStore property
            this.mainStore = this.loginEmployee.storeCheckIn.find(x => x.isOn == true);


        });
    }

    buildProductGridDataFromServerResponse(serverModel: any[]): any[] {
       
        
            const res: any[]  =  _.map(serverModel, (x) =>{
                const viewData : any = {
                    createdAt  : x.createdAt,
                    comment : x.comment,
                    storeId : x.storeId,
                    storeObject : x.storeObject,
                    destinationStoreId : x.destinationStoreId,
                    destinationStoreObject : x.destinationStoreObject,
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
                           // unitOfMeasure : i.productObject.productConfiguration.name || '',
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
                
                console.log(viewData, "View Data");
                return viewData;
            });  
     
        
        
        return res;
    }

    getStoreOutboundFromServer() {
        //TODO Add Pagination Logic

        this.isLoadingFromServer = true;
        this.storeOutboundService.find({
            query: {
                comment: 'OUTBOUND-REQ',
                facilityId: this.locService.facilityId,
                //destinationStoreId: this.storeName.value,
                storeId: this.mainStore._id,
                $limit : this.pagerSource.pageSize,
                $skip  : this.pagerSource.currentPage * this.pagerSource.pageSize
            }
        })
            .then(x => {
              
                this.isLoadingFromServer = false;
                this.pagerSource.totalRecord =  x.total;
                let count  = 0 , amt  = 0 ;
                 // = x.data;
                this.serverData = this.buildProductGridDataFromServerResponse(x.data);
               
                /*if (x.data.length > 0) {
                    this.serverData  = this.buildProductGridDataFromServerResponse(x.data);
                    this.serverData.forEach(x  => {
                        count += x.items.length;
                        amt =  _.sumBy(x.items, y => {
                            return y.qtyToSend * y.price;
                        })
                    });
                  /!*  this.totalItems  = count;
                    this.totalItemsAmount  = amt;*!/
                }*/
                
            }, x => {
                this.isLoadingFromServer = false;
                console.log("Could not complete operation on the server", x);
            });
    }  
    gotoPage(pageIndex : number)
    {
        this.pagerSource.currentPage = pageIndex;
        this.getStoreOutboundFromServer();
    }
}
