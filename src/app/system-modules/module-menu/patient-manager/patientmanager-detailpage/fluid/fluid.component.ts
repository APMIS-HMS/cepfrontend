import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

import {
  ProfessionService, RelationshipService, MaritalStatusService, GenderService,
  TitleService, CountriesService, PatientService, PersonService, EmployeeService, FacilitiesService, FacilitiesServiceCategoryService,
  BillingService, ServicePriceService, HmoService, FamilyHealthCoverService, FluidService
} from '../../../../../services/facility-manager/setup/index';

var moment = require("moment");

@Component({
  selector: 'app-fluid',
  templateUrl: './fluid.component.html',
  styleUrls: ['./fluid.component.scss']
})
export class FluidComponent implements OnInit {

  public frmIntake: FormGroup;
  public frmOutput: FormGroup;
  inInterval = new FormControl();
  outInterval = new FormControl();

  lineChartOptions: any;

  intakeFluidList;
  outputFluidList;

  loading;
  intakeLoading;
  outputLoading;
  filterIntakeLoading;
  filterOutputLoading;

  patient = <any>this.locker.getObject('patient');
  facility = this.facilityService.getSelectedFacilityId();

  patientIntakeFluidList: any = [];
  patientOutputFluidList: any = [];

  totalPatientIntakeFluid;
  totalPatientOutputFluid;

  rateOfIntakeFluid;
  rateOfOutputFluid;

  // lineChart
  public lineChartData: Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [78, 68, 10, 99, 46, 37, 20],
    [68, 48, 30, 29, 86, 27, 60],
    [18, 58, 80, 49, 56, 17, 10]
  ];
  public lineChartLabels: Array<any> = ['Drip', 'Salinity', 'Alkaline', 'H20', 'Carbonozine'];
  public lineChartType: string = 'line';

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  getFluids(type: any) {
    this.fluidService.find({
      query: {
        "type": type
      }
    }).then(payload => {
      console.log(payload);
      if (type == "intake") {
        this.intakeFluidList = payload.data;
      } else if (type == "output") {
        this.outputFluidList = payload.data;
      }
    })
  }

  constructor(private formBuilder: FormBuilder,
    private fluidService: FluidService,
    private locker: CoolLocalStorage, private patientService: PatientService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.frmIntake = this.formBuilder.group({
      infusion: ['', [<any>Validators.required]],
      infusion_volume: ['', [<any>Validators.required]],
      infusion_quantity: ['', [<any>Validators.required]]
    });

    this.frmOutput = this.formBuilder.group({
      fluid: ['', [<any>Validators.required]],
      output_volume: ['', [<any>Validators.required]],
      output_quantity: ['', [<any>Validators.required]]
    });

    this.getFluids('intake');
    this.getFluids('output');

    this.getPatientFluids('intake');
    this.getPatientFluids('output');

    this.getFluidSummary();

    //this.filterByTime('intake', '2');

  }

  addPatientFluid(type: any) {

    if (type == "intake") {
      this.intakeLoading = true;
    } else if (type == "output") {
      this.outputLoading = true;
    }

    let fluidItem = (type == "intake") ? this.frmIntake.controls['infusion'].value : this.frmOutput.controls['fluid'].value;
    let volume = (type == "intake") ? this.frmIntake.controls['infusion_volume'].value : this.frmOutput.controls['output_volume'].value;
    let quantity = (type == "intake") ? this.frmIntake.controls['infusion_quantity'].value : this.frmOutput.controls['output_quantity'].value;


    let fluidsCont = {
      fluid: {
        name: fluidItem.name,
        _id: fluidItem._id
      },
      type: type,
      volume: volume,
      measurement: quantity,
      patientId: this.patient._id,
      facilityId: this.facility._id
    }

    this.fluidService.createPatientFluid(fluidsCont).then(payload => {
      this.loading = false;
      this.frmIntake.reset();
    }).catch(err => {
      console.log(err);
      this.loading = false;
    });


  }

  getPatientFluids(type) {
    this.fluidService.findPatientFluid({
      query: {
        "facilityId": this.facility._id,
        "patientId": this.patient._id,
        "type": type
      }
    }).then((payload) => {
      if (type == "intake") {
        this.patientIntakeFluidList = payload.data;
        let len = this.patientIntakeFluidList.length;
        let lol = 0;
        for (var i = len - 1; i >= 0; i--) {
          lol += Number(this.patientIntakeFluidList[i].volume);
        }
        this.totalPatientIntakeFluid = lol;
        this.rateOfIntakeFluid = Math.floor(this.totalPatientIntakeFluid / 24);
        console.log(this.patientIntakeFluidList);
      } else if (type == "output") {
        this.patientOutputFluidList = payload.data;
        let len = this.patientOutputFluidList.length;
        let lol = 0;
        for (var i = len - 1; i >= 0; i--) {
          lol += Number(this.patientOutputFluidList[i].volume);
        }
        this.totalPatientOutputFluid = lol;
        this.rateOfOutputFluid = Math.floor(this.totalPatientOutputFluid / 24);
        console.log(this.patientOutputFluidList);
        this.patientOutputFluidList = payload.data;
        console.log(this.patientOutputFluidList);
      }
      console.log(payload);
    }).catch(err => {
      console.log(err);
    });
  }

  filterByTime(type?, time?) {

    if (type == "intake") {
      this.filterIntakeLoading = true;
    } else if (type == "output") {
      this.filterOutputLoading = true;
    }

    this.fluidService.findPatientFluid({
      query: {
        "facilityId": this.facility._id,
        "patientId": this.patient._id,
        "type": type
      }
    }).then((payload) => {
      var a = moment();
      var b;
      let len = payload.data.length;
      let lol = 0;

      if (type == "intake") {

        this.filterIntakeLoading = false;

        this.patientIntakeFluidList = [];

        for (var i = len - 1; i >= 0; i--) {
          b = moment(payload.data[i].createdAt);
          let mm2 = a.diff(b, 'hours');
          console.log(mm2);
          if (mm2 <= time) {
            this.patientIntakeFluidList.push(payload.data[i]);
            //console.log(payload.data[i].volume);
            lol += Number(payload.data[i].volume);
          }
        }
        this.totalPatientIntakeFluid = lol;
        this.rateOfIntakeFluid = Math.floor(this.totalPatientIntakeFluid / time);
        console.log(this.patientIntakeFluidList);

      } else if (type == "output") {
        this.filterOutputLoading = false;
        this.patientOutputFluidList = [];

        for (var i = len - 1; i >= 0; i--) {
          b = moment(payload.data[i].createdAt);
          let mm2 = a.diff(b, 'hours');
          console.log(mm2);
          if (mm2 <= time) {
            this.patientOutputFluidList.push(payload.data[i]);
            lol += Number(payload.data[i].volume);
          }
        }
        this.totalPatientOutputFluid = lol;
        this.rateOfOutputFluid = Math.floor(this.totalPatientOutputFluid / time);
        console.log(this.patientOutputFluidList);
      }
    }).catch(err => {
      this.filterIntakeLoading = false;
      this.filterOutputLoading = false;
      console.log(err);
    });
  }

  getFluidSummary() {
    this.fluidService.findPatientFluid({
      query: {
        "facilityId": this.facility._id,
        "patientId": this.patient._id,
        "type": 'intake'
      }
    }).then(payload => {
      let newArr = [];
      let arr;
      let len = payload.data.length;
      for (let i = len - 1; i >= 0; i--) {
        if (newArr[i] == payload.data[i].fluid.name) {
          newArr[i].name = payload.data[i].fluid.name;
          newArr[i].volume.push(payload.data[i].volume);

        } else {
          newArr.push({ name: payload.data[i].fluid.name, volume: [] });
        }

      }

      console.log(newArr);
    });
  }


}