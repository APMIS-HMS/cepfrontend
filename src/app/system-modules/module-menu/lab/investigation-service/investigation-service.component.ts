import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationSpecimenService } from '../../../../services/facility-manager/setup/index';

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

  investigation_view = false;
  pannel_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  isNumeric = false;

  reportTypes: any[] = ['Numeric', 'Text'];
  specimens: any[] = [];

  public frmNewInvestigationh: FormGroup;
  public frmNewPanel: FormGroup;

  constructor(private formBuilder: FormBuilder, private specimenService: InvestigationSpecimenService) { }

  ngOnInit() {
    this.frmNewInvestigationh = this.formBuilder.group({
      investigationName: ['', [Validators.required]],
      ref: ['', [Validators.required]],
      maxRef: ['', [Validators.required]],
      reportType: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      specimen: ['', [Validators.required]],
    });

    this.frmNewInvestigationh.controls['reportType'].valueChanges.subscribe(value => {
      if (value === 'Numeric') {
        this.isNumeric = true;
      } else {
        this.isNumeric = false;
      }
    })

    this.frmNewPanel = this.formBuilder.group({
      panelName: ['', [Validators.required]]
    });
    this.getSpecimens();
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

  close_onClick(message: boolean): void {
  }
}
