import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
import {InventoryService, StoreService} from "../../../../../services/facility-manager/setup";

@Component({
  selector: 'app-outbound-requisition',
  templateUrl: './outbound-requisition.component.html',
  styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

  check:FormControl = new FormControl();
  storeLocation:FormControl = new FormControl();
  storeName:FormControl = new FormControl();
    
  locations : any[]   =[]; stores : any[]   =[];
  constructor(private locService  : ReportGeneratorService, 
              private storeService : StoreService,
              private inventoryService  : InventoryService
              ) { }

  ngOnInit() {
    this.getLocations();
  }
  getLocations()
  {
     this.locations  = this.locService.getLocations();
  }
  getStoresInLocation()
  {
     const selectedLocId  = (this.storeLocation.value);
     if(this.stores.length  === 0)  // I included the check because the storeService does not filter by location at the moment
     {
         this.storeService.find({
             facilityId : this.locService.facilityId,
             minorLocationId  : selectedLocId
         }).then(x => {

             const stores  = _.map(x.data, s => {

                 return  { storeName : s.name, storeId : s._id, description : s.description,
                     products : s.productTypeId
                 };
             });
             console.log(stores, " Stores ", x.data);
             this.stores  = stores;
         }, x => {
             console.log("There is an issue connecting with the server!", x);
         });
     }
     
  }
  
  findProductInStore(searchText : string)
  {
      // 
      
      const selectedStore : string   =  this.storeName.value;
      console.log("Selected Store Id  : ", selectedStore, "Facility ID :", this.locService.facilityId);
      if(_.isEmpty(selectedStore))
      {
          alert("Select a Store");
          
          return ;
      }
      this.inventoryService.findFacilityProductList(
          {
              query : {
                 facilityId : this.locService.facilityId,
                  storeId : selectedStore,
                  searchText : searchText,
                  limit : 20,
                  skip : 0
                  
                
              }
          }
      ).then(x =>{
         
          console.log(x, "Inventory Service Search Result");
      });
      
      
  }
}
