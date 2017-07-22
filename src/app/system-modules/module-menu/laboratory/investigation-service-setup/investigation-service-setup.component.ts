import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, User, Investigation, InvestigationSpecimen, InvestigationReportType } from '../../../../models/index';
import { 
  FacilitiesService, InvestigationService, InvestigationSpecimenService, InvestigationReportTypeService
 } from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-investigation-service-setup',
  templateUrl: './investigation-service-setup.component.html',
  styleUrls: ['./investigation-service-setup.component.scss']
})
export class InvestigationServiceSetupComponent implements OnInit {
    investigationForm: FormGroup;
    facility: Facility = <Facility>{};
    user: User = <User>{};
    specimens: any[] = [];
    reportTypes: any[] = [];
    isParent: boolean = true;
    isPanel: boolean = false;
    flyout: boolean = false;
    openModal: boolean = false;
    viewPanel: boolean = false;
    selectedPanel: boolean = true;
    investigationBtnText: string = 'Create Investigation';
    disableInvestigationBtn: boolean = false;

  constructor(
    private _fb: FormBuilder,
		private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _investigationService: InvestigationService,
    private _investigationSpecimenService: InvestigationSpecimenService,
    private _investigationReportTypeService: InvestigationReportTypeService
  ) { }

  ngOnInit() {
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    this._getReportTypes();
    this._getSpecimens();

    this.investigationForm = this._fb.group({
      investigation: ['', [<any>Validators.required]],
      specimen: ['', [<any>Validators.required]],
      reportType: ['', [<any>Validators.required]],
      refNoFrom: ['', [<any>Validators.required]],
      refNoTo: ['', [<any>Validators.required]],
      unit: ['', [<any>Validators.required]],
      isActive: ['', [<any>Validators.required]],
    });
  }

  createInvestigation(value: any, valid: boolean) {
    if(valid) {
      console.log(value);
      console.log(valid);
      this.investigationBtnText = "Creating Investigation... <i class='fa fa-spinner fa-spin'></i>";
      this.disableInvestigationBtn = true;
      const investigation = <Investigation>({
        name: value.investigation,
        specimen: <InvestigationSpecimen> value.specimen,
        reportType: <InvestigationReportType>value.reportType,
        refNoFrom: value.refNoFrom,
        refNoTo: value.refNoFrom,
        unit: value.unit,
        isActive: true,
      });
      console.log(investigation);
      // Create investigation
      // this._investigationService.create(investigation)
      //   .then(res => {
      //     console.log(res);
      //     this.disableInvestigationBtn = false;
      //     this.investigationBtnText = "Create Investigation";
      //     this.investigationForm.reset();
      //   })
      //   .catch(err => { console.log(err); });
    } else {
      this._notification('Info', 'Some fields are empty. Please fill in all required Fields!')
    }
  }

  private _getSpecimens() {
    this._investigationSpecimenService.findAll()
      .then(res => {
        console.log(res);
        this.specimens = res.data;
      })
      .catch(err => { console.log(err); });
  }
  
  private _getReportTypes() {
    this._investigationReportTypeService.findAll()
      .then(res => {
        console.log(res);
        this.reportTypes = res.data;
      })
      .catch(err => { console.log(err); });
  }

  panelShow() {
    this.isPanel = !this.isPanel;
  }
  clickParent() {
    this.isParent = !this.isParent;
  }
    close_onClick() {
    this.flyout = true;
  }
  flayoutClose() {
    this.flyout = false;
  }
   modal_onClick() {
    this.openModal = true;
  }
  closeModal()  {
    this.openModal = false;
  }
  viewPanelShow() {
    this.viewPanel = true;
    this.selectedPanel = false;
  }

  backIvestigation() {
    this.viewPanel = false;
    this.selectedPanel = true;
  }

  // Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
