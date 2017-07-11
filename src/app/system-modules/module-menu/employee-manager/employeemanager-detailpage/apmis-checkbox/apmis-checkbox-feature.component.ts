import { Component, OnInit, Input } from '@angular/core';
import { FeatureModuleViewModel } from '../../../../../models/index';
import { FeatureModuleService } from '../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../services/facility-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
@Component({
  selector: 'app-apmis-checkbox-feature',
  templateUrl: './apmis-checkbox-feature.component.html',
  styleUrls: ['./apmis-checkbox-feature.component.scss']
})
export class ApmisCheckboxFeatureComponent implements OnInit {
  @Input() selectedFeature = <FeatureModuleViewModel>{};
  expand: boolean = false;
  expandMain: boolean = false;
  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolSessionStorage,
    private accessControlService: AccessControlService) { }

  ngOnInit() {
  }
  checked(e, item: any) {
    if (e.target.checked) {
      this.expand = true;
    } else {
      this.expand = false;
    }
  }
}
