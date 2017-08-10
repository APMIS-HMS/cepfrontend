import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationSpecimenService, InvestigationService } from '../../../../services/facility-manager/setup/index';
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-investigation-service',
  templateUrl: './investigation-service.component.html',
  styleUrls: ['./investigation-service.component.scss']
})
export class InvestigationServiceComponent implements OnInit {

  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = '';
  btnText = 'Create Investigation';
  panelBtnText = "Create Panel";

  investigation_view = false;
  pannel_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  isNumeric = false;
  selectedFacility: Facility = <Facility>{};
  selectedInvestigation: any = <any>{};

  reportTypes: any[] = ['Numeric', 'Text'];
  specimens: any[] = [];
  investigations: any[] = [];
  bindInvestigations: any[] = [];
  movedInvestigations: any[] = [];

  public frmNewInvestigationh: FormGroup;
  public frmNewPanel: FormGroup;

  constructor(private formBuilder: FormBuilder, private specimenService: InvestigationSpecimenService,
    private locker: CoolSessionStorage, private investigationService: InvestigationService, private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(value)
      // console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(value)
      // console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    // dragulaService.over.subscribe((value) => {
    //   console.log(`over: ${value[0]}`);
    //   this.onOver(value.slice(1));
    // });
    // dragulaService.out.subscribe((value) => {
    //   console.log(`out: ${value[0]}`);
    //   this.onOut(value.slice(1));
    // });
  }
  private onDrag(args) {
    let [e, el] = args;
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
  }
  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('miniFacility')
    this.frmNewInvestigationh = this.formBuilder.group({
      investigationName: ['', [Validators.required]],
      ref: ['', [Validators.required]],
      maxRef: ['', []],
      reportType: ['Text', [Validators.required]],
      unit: ['', [Validators.required]],
      specimen: ['', [Validators.required]],
      isPanel: [false, [Validators.required]]
    });

    this.frmNewInvestigationh.controls['reportType'].valueChanges.subscribe(value => {
      if (value === 'Numeric') {
        this.isNumeric = true;
      } else {
        this.isNumeric = false;
      }
    })

    this.frmNewPanel = this.formBuilder.group({
      panelName: ['', [Validators.required]],
      isPanel: [true, [Validators.required]]
    });
    this.getSpecimens();
    this.getInvestigations();
  }

  getInvestigations() {
    this.investigationService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      console.log(payload);
      this.investigations = payload.data;
      this.bindInvestigations = payload.data;
    })
  }
  editInvestigation(investigation) {
    console.log(investigation)
    if (!investigation.isPanel) {
      this.selectedInvestigation = investigation;
      this.frmNewInvestigationh.controls['investigationName'].setValue(this.selectedInvestigation.name);
      this.frmNewInvestigationh.controls['specimen'].setValue(this.selectedInvestigation.specimen);
      this.frmNewInvestigationh.controls['isPanel'].setValue(this.selectedInvestigation.isPanel);
      this.frmNewInvestigationh.controls['unit'].setValue(this.selectedInvestigation.unit);
      if (this.selectedInvestigation.reportType !== undefined) {
        if (this.selectedInvestigation.reportType.name === 'Text') {
          this.frmNewInvestigationh.controls['reportType'].setValue(this.selectedInvestigation.reportType.name);
          this.frmNewInvestigationh.controls['ref'].setValue(this.selectedInvestigation.reportType.ref);
        } else if (this.selectedInvestigation.reportType.name === 'Numeric') {
          this.frmNewInvestigationh.controls['reportType'].setValue(this.selectedInvestigation.reportType.name);
          this.frmNewInvestigationh.controls['ref'].setValue(this.selectedInvestigation.reportType.ref.min);
          this.frmNewInvestigationh.controls['maxRef'].setValue(this.selectedInvestigation.reportType.ref.max);
        }
      }

      this.btnText = 'Update Investigation';
      this.investigation_view = true;
    } else {
      console.log('not panel')
      this.movedInvestigations = investigation.panel;
      this.frmNewPanel.controls['panelName'].setValue(investigation.name);
      this.panelBtnText = 'Update Panel';
      this.investigation_view = false;
      this.pannel_view = true;

    }

  }
  getSpecimens() {
    this.specimenService.findAll().then(payload => {
      this.specimens = payload.data;
      console.log(this.specimens)
    });
  }

  apmisLookupHandleSelectedItem(value) {

  }
  investigation_show() {
    this.investigation_view = !this.investigation_view;
    this.pannel_view = false;
  }
  pannel_show() {
    this.pannel_view = !this.pannel_view;
    this.investigation_view = false;
  }

  specimenDisplayFn(specimen: any) {
    return specimen ? specimen.name : specimen;
  }
  getRefrenceValues(reportType) {
    if (reportType !== undefined && reportType.name === 'Numeric') {
      return reportType.ref.min + ' - ' + reportType.ref.max;
    } else if (reportType !== undefined && reportType.name !== 'Numeric') {
      return reportType.ref;
    } else {
      return '';
    }
  }

  createInvestigation(valid, value) {
    console.log(valid);
    console.log(value);
    if (valid) {
      if (this.selectedInvestigation._id === undefined) {
        let investigation: any = {
          facilityId: this.locker.getObject('miniFacility'),
          name: value.investigationName,
          unit: value.unit,
          specimen: value.specimen,
        }
        let reportType: any = {};
        if (value.reportType === 'Text') {
          reportType.name = value.reportType;
          reportType.ref = value.ref;
          investigation.reportType = reportType;
        } else if (value.reportType === 'Numeric') {
          reportType.name = value.reportType;
          reportType.ref = {
            max: value.maxRef,
            min: value.ref
          }
          investigation.reportType = reportType;
        }
        console.log(investigation)
        this.investigationService.create(investigation).then(payload => {
          console.log(payload);
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
          this.investigations.push(payload);
        })
      } else {
        this.selectedInvestigation.name = this.frmNewInvestigationh.controls['investigationName'].value;
        this.selectedInvestigation.specimen = this.frmNewInvestigationh.controls['specimen'].value;
        this.selectedInvestigation.isPanel = this.frmNewInvestigationh.controls['isPanel'].value;
        this.selectedInvestigation.unit = this.frmNewInvestigationh.controls['unit'].value;
        let reportType: any = {};
        if (value.reportType === 'Text') {
          reportType.name = value.reportType;
          reportType.ref = value.ref;
          this.selectedInvestigation.reportType = reportType;
        } else if (value.reportType === 'Numeric') {
          reportType.name = value.reportType;
          reportType.ref = {
            max: value.maxRef,
            min: value.ref
          }
          this.selectedInvestigation.reportType = reportType;
        }
        this.investigationService.update(this.selectedInvestigation).then(payload => {
          this.investigation_view = false;
          this.btnText = 'Create Investigation';
          this.selectedInvestigation = <any>{};
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
          const index = this.investigations.findIndex((obj => obj._id === payload._id));
          this.investigations.splice(index, 1, payload);
        }, error => {
          this.btnText = 'Create Investigation';
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
        })
      }
    }
  }
  createPanel(valid, value) {
    console.log(valid);
    console.log(value);
    console.log(this.movedInvestigations);
    if (valid) {
      if (this.selectedInvestigation._id === undefined) {
        let investigation: any = {
          facilityId: this.locker.getObject('miniFacility'),
          isPanel:true,
          name: value.panelName,
          panel: this.movedInvestigations
        }
        console.log(investigation)
        this.investigationService.create(investigation).then(payload => {
          console.log(payload);
          this.frmNewPanel.reset();
          this.frmNewPanel.controls['isPanel'].setValue(true);
          this.investigations.push(payload);
        })
      } else {
        this.selectedInvestigation.name = this.frmNewInvestigationh.controls['panelName'].value;
        this.selectedInvestigation.isPanel = this.frmNewInvestigationh.controls['isPanel'].value;
        this.selectedInvestigation.panel = this.movedInvestigations;
       
        this.investigationService.update(this.selectedInvestigation).then(payload => {
          this.investigation_view = false;
          this.btnText = 'Create Investigation';
          this.selectedInvestigation = <any>{};
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
          const index = this.investigations.findIndex((obj => obj._id === payload._id));
          this.investigations.splice(index, 1, payload);
        }, error => {
          this.btnText = 'Create Investigation';
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
        })
      }
    }
  }
  close_onClick(message: boolean): void {
  }
}
