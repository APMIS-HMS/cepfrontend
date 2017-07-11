import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../services/facility-manager/setup/index';
// tslint:disable-next-line:max-line-length
import { FeatureModule, AccessControl, FeatureModuleViewModel, FacilityModule, Facility, Address, Profession, Relationship, Employee, Person, MaritalStatus, Department, MinorLocation, Gender, Title, Country } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-access',
  templateUrl: './create-access.component.html',
  styleUrls: ['./create-access.component.scss']
})
export class CreateAccessComponent implements OnInit {

  txtAccessName = new FormControl();
  searchFeature = new FormControl();

  searchfeatureActive = false;
  selectedFacility: Facility = <Facility>{};
  selectedAccessControl: AccessControl = <AccessControl>{};

  dashboard: FeatureModule[] = [];
  groups: FeatureModuleViewModel[] = [];
  superGroups: any[] = [];
  btnTitle = 'Create Access';

  innerMenuShow = false;

  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolSessionStorage,
    private router: Router,
    private route: ActivatedRoute,
    private accessControlService: AccessControlService) { }

  ngOnInit() {
    this.txtAccessName.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.getModules();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== undefined) {
        this.accessControlService.get(id, {}).then(payload => {
          this.selectedAccessControl = payload;
          this.txtAccessName.setValue(this.selectedAccessControl.name);
          this.populateAccessControl();
          this.btnTitle = 'Update Access';
        });
      }
    });
  }
  populateAccessControl() {
    if (this.selectedAccessControl !== undefined) {
      this.superGroups.forEach((item, i) => {
        const group = <[FeatureModuleViewModel]>item;
        group.forEach((grp, j) => {
          this.selectedAccessControl.featureList.forEach((iItem, j) => {
            if (iItem._id === grp._id) {
              grp.checked = true;
            }
          });
        });
      });
    }
  }
  getModules() {
    this.featureModuleService.findAll().then(payload => {
      this.dashboard = payload.data;

      let group: FeatureModuleViewModel[] = [];
      const count = this.dashboard.length;
      this.dashboard.forEach((item, i) => {
        if (i === 0 || group.length === 5) {
          if (group.length === 5) {
            this.superGroups.push(group);
            group = [];
            group.push(<FeatureModuleViewModel>{ checked: false, name: item.name, _id: item._id });
          }else {
            group = [];
            group.push(<FeatureModuleViewModel>{ checked: false, name: item.name, _id: item._id });
          }

        }else {
          group.push(<FeatureModuleViewModel>{ checked: false, name: item.name, _id: item._id });
          if ((count - 1) === i) {
            this.superGroups.push(group);
          }
        }
      });
    });
  }
  create() {
    let accessControl: AccessControl = <AccessControl>{ features: [] };
    accessControl.name = this.txtAccessName.value;
    if (this.btnTitle === 'Update Access') {
      this.selectedAccessControl.features = [];
      accessControl = this.selectedAccessControl;
    }

    this.superGroups.forEach((item, i) => {
      const group = <[FeatureModuleViewModel]>item;
      group.forEach((grp, j) => {
        if (grp.checked) {
          accessControl.features.push(grp._id);
        }
      });
    });
    accessControl.facilityId = this.selectedFacility._id;
    if (this.btnTitle === 'Create Access') {
      this.accessControlService.create(accessControl).then(
        payload => {
          this.txtAccessName.reset();
          this.superGroups.forEach((item, i) => {
            const group = <[FeatureModuleViewModel]>item;
            group.forEach((grp, j) => {
              if (grp.checked) {
                grp.checked = false;
              }
            });
          });
          this.router.navigate(['/dashboard/access-manager/access']);
        },
        error => {
          console.log(error);
        });
    }else {
      this.accessControlService.update(accessControl).then(payload => {
        this.router.navigate(['/dashboard/access-manager/access']);
      });
    }


  }
  searchFeatureToggle() {
    this.searchfeatureActive = !this.searchfeatureActive;
  }
  // -------------Beggining of first section-------------------

  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }

}
