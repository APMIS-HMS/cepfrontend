import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesService, FacilityModuleService } from '../../../../services/facility-manager/setup/index';
import { FacilityModule, Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-facilitypage-modulespage',
  templateUrl: './facilitypage-modulespage.component.html',
  styleUrls: ['./facilitypage-modulespage.component.scss']
})
export class FacilitypageModulespageComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  allModulesShow = true;
  integratedModulesShow = false;
  unintegratedModulesShow = false;

  systemModules: FacilityModule[] = [];
  facilityModules: FacilityModule[] = [];
  constructor(private facilityModuleService: FacilityModuleService,
    private locker: CoolLocalStorage,
    private route: ActivatedRoute,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.pageInView.emit('Facility Modules');
    /* this.route.data.subscribe(data => {
      console.log(data);
      data['systemModules'].subscribe((payload: any[]) => {
        this.systemModules = payload;
      });
      data['facility'].subscribe((payload: any) => {
        if (payload.facilityModules !== undefined) {
          this.facilityModules = payload.facilityModules;
        }
      });
    }); */
  }
  isIntegrated(value: any): boolean {
    let obj = this.facilityModules.find(x => x._id === value.toString());
    if (obj == null) {
      return true;
    }
    return false;
  }
  getModules() {
    this.facilityModuleService.findAll().then((payload) => {
      this.systemModules = payload.data;
    });
  }
  getFacility() {
    let tokenObj: any = this.locker.getObject('auth');
    this.facilityService.get(tokenObj.data.facilitiesRole[0].facilityId, {}).then((payload) => {
      this.facilityModules = payload.facilityModules;
    },
      error => {
      })
  }

  activate(id){
    let facility = <any>this.locker.getObject("selectedFacility");
    facility.facilityModulesId.push(id);

    this.facilityService.update(facility).then(payload => {
      this.getModules();
      this.getFacility();
    });

  }

  deactivate(id){
    let facility = <any>this.locker.getObject("selectedFacility");
    let ind = facility.facilityModulesId.indexOf(id.toString());

    facility.facilityModulesId.splice(ind, 1);
    this.facilityService.update(facility).then(payload => {
      this.getModules();
      this.getFacility();
    });

  }

  allModuleTab() {
    this.allModulesShow = true;
    this.integratedModulesShow = false;
    this.unintegratedModulesShow = false;
  }
  integratedModuleTab() {
    this.allModulesShow = false;
    this.integratedModulesShow = true;
    this.unintegratedModulesShow = false;
  }
  unintegratedModuleTab() {
    this.allModulesShow = false;
    this.integratedModulesShow = false;
    this.unintegratedModulesShow = true;
  }

} 
