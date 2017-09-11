import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FacilitiesService, EmployeeService, WorkSpaceService } from '../../../../services/facility-manager/setup/index';
import { Facility, WorkSpace } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from '../../../../services/module-manager/setup/location.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-facilitypage-workspace',
  templateUrl: './facilitypage-workspace.component.html',
  styleUrls: ['./facilitypage-workspace.component.scss']
})
export class FacilitypageWorkspaceComponent implements OnInit {

  del_workspace = false;
  globalDialog = false;

  createWorkspace = false;
  searchControl: FormControl = new FormControl();
  selectedFacility: Facility = <Facility>{};
  workSpaces: WorkSpace[] = [];


  public title = 'Popover title';
  public message = 'Popover description';
  public confirmClicked = false;
  public cancelClicked = false;

  gdTitle = 'Delete Workspace';
  gdItem = '';
  gdComponent = 'Workspace';

  selectedWorkSpace: any = <any>{};
  // loadIndicatorVisible = true;
  constructor(private locker: CoolLocalStorage,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private workspaceService: WorkSpaceService,
    public facilityService: FacilitiesService) {
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.workspaceService.listenerCreate.subscribe(payload => {
      this.getWorkSpace();
    });
    this.workspaceService.listenerUpdate.subscribe(payload => {
      this.getWorkSpace();
    });

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      data['workSpaces'].subscribe((payload) => {
        this.workSpaces = payload;
      });
    });

  }
  getWorkSpace() {
    this.workspaceService.find({ query: { facilityId: this.selectedFacility._id, $limit: 40 } })
      .then(payload => {
        const result = payload.data.filter(x => x.isActive === true || x.isActive === undefined);
        result.forEach((itemi: WorkSpace, i) => {
          itemi.locations = itemi.locations.filter(x => x.isActive === true);
        });
        this.workSpaces = result;
      });
  }
  removeLocation(location, workSpace: WorkSpace, i) {
    workSpace.locations[i].isActive = false;

    this.workspaceService.update(workSpace).then(payload => {
      this.getWorkSpace();
    });
  }
  deletion_popup(workSpace) {
    this.selectedWorkSpace = workSpace;
    this.gdItem = workSpace.employeeObject.employeeDetails.lastName + ' ' + workSpace.employeeObject.employeeDetails.firstName;
    this.globalDialog = true;
  }
  createWorkspace_pop() {
    this.createWorkspace = true;
  }
  close_onClick(e) {
    this.createWorkspace = false;
    this.globalDialog = false;
  }
  getActiveWorkSpaceCount(workSpace: WorkSpace) {
    return workSpace.locations.filter(x => x.isActive === true).length;
  }
  delete_onClick($event) {
    console.log($event);
    if ($event) {
      this.selectedWorkSpace.isActive = false;
      const update$ = Observable.fromPromise(this.workspaceService.update(this.selectedWorkSpace));
      const get$ = Observable.fromPromise(this.workspaceService.find({ query: { facilityId: this.selectedFacility._id, $limit: 40 } }));

      Observable.forkJoin([update$, get$]).subscribe((results: any) => {
        const result = results[1].data.filter(x => x.isActive === true);
        result.forEach((itemi: WorkSpace, i) => {
          itemi.locations = itemi.locations.filter(x => x.isActive === true);
        });
        this.workSpaces = result;
        this.globalDialog = false;
      }, error => {
        this.globalDialog = false;
      });
    }
  }
}
