import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  DocumentationService, VitaLocationService, VitalRythmService, VitalPositionService,
  EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Documentation, Employee } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Component({
  selector: 'app-add-vitals',
  templateUrl: './add-vitals.component.html',
  styleUrls: ['./add-vitals.component.scss']
})
export class AddVitalsComponent implements OnInit {
  @Input() selectedAppointment: any;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  vitalRythm: any[] = [];
  vitalPosition: any[] = [];
  vitalLocation: any[] = [];
  selectedFacility: Facility = <Facility>{};
  loginedUser: Employee = <Employee>{};
  documentation: Documentation = <Documentation>{};
  pulseRate: any = <any>{};
  respiratoryRate: any = <any>{};
  temperature: any = <any>{};
  heightWeight: any = <any>{};
  bloodPressure: any = <any>{};
  bmi: number = <number>{};
  isWarning = false;
  bmiWarningMssg = '';

  public frmAddVitals: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private formBuilder: FormBuilder,
    private documentationService: DocumentationService,
    private _vitaLocationService: VitaLocationService,
    private _vitalPositionService: VitalPositionService,
    private _vitalRythmService: VitalRythmService,
    private _locker: CoolLocalStorage,
    private _employeeService: EmployeeService) { }

  ngOnInit() {
    this.selectedFacility = this._locker.get('selectedFacility');
    const auth = this._locker.get('auth');
    this._employeeService.find({
      query:
      {
        facilityId: this.selectedFacility._id, personId: auth.data.personId
      }
    }).then(payload => {
      this.loginedUser = payload.data[0];
      console.log(this.loginedUser);
    });
    this.frmAddVitals = this.formBuilder.group({

      pulseRate: ['', []],
      pulseLoc: ['', []],
      pulseRythm: ['', []],
      diastolicBp1: ['', []],
      diastolicBp1Loc: ['', []],
      diastolicBp1Pos: ['', []],
      systolicBp1: ['', []],
      systolicBp1Loc: ['', []],
      systolicBp1Pos: ['', []],
      respiratoryRate: ['', []],
      temp: ['', []],
      height: ['', []],
      weight: ['', []]
    });
    this.getVitalLocation();
    this.getVitalPosition();
    this.getVitalRythm();

    this.frmAddVitals.controls['height'].valueChanges.subscribe(value => {
      const heightSquare = (+this.frmAddVitals.controls['height'].value) * (+this.frmAddVitals.controls['height'].value);
      const bmiValue = (+this.frmAddVitals.controls['weight'].value) / heightSquare;
      this.bmi = Math.round(bmiValue * 10) / 10;
      if (this.bmi < 16) {
        this.bmiWarningMssg = 'Severe Thinness';
        this.isWarning = true;
      }      else if (this.bmi >= 25 && this.bmi < 30) {
        this.bmiWarningMssg = 'Overweight';
        this.isWarning = true;
      } else if (this.bmi > 30) {
        this.bmiWarningMssg = 'Obese Class';
        this.isWarning = true;
      } else {
        this.isWarning = false;
      }
    });

    this.frmAddVitals.controls['weight'].valueChanges.subscribe(value => {
      const heightSquare = (+this.frmAddVitals.controls['height'].value) * (+this.frmAddVitals.controls['height'].value);
      const bmiValue = (+this.frmAddVitals.controls['weight'].value) / heightSquare;
      this.bmi = Math.round(bmiValue * 10) / 10;
      if (this.bmi < 16) {
        this.bmiWarningMssg = 'Severe Thinness';
        this.isWarning = true;
      } else if (this.bmi >= 25 && this.bmi < 30) {
        this.bmiWarningMssg = 'Overweight';
        this.isWarning = true;
      } else if (this.bmi > 30) {
        this.bmiWarningMssg = 'Obese Class';
        this.isWarning = true;
      } else {
        this.isWarning = false;
      }
    });
  }

  getVitalPosition() {
    this._vitalPositionService.findAll().then(payload => {
      this.vitalPosition = payload.data;
      console.log(this.vitalPosition);
    });
  }
  getVitalRythm() {
    this._vitalRythmService.findAll().then(payload => {
      this.vitalRythm = payload.data;
    });
  }
  getVitalLocation() {
    this._vitaLocationService.findAll().then(payload => {
      this.vitalLocation = payload.data;
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  addVitals(valid, value) {
    if (valid) {
      const vitalValue: any = <any>{};
      this.pulseRate.pulseRateValue = this.frmAddVitals.controls['pulseRate'].value;
      this.pulseRate.location = this.frmAddVitals.controls['pulseLoc'].value;
      this.pulseRate.rythm = this.frmAddVitals.controls['pulseRythm'].value;
      this.respiratoryRate = this.frmAddVitals.controls['respiratoryRate'].value;
      this.temperature = this.frmAddVitals.controls['temp'].value;
      this.heightWeight.height = this.frmAddVitals.controls['height'].value;
      this.heightWeight.weight = this.frmAddVitals.controls['weight'].value;
      this.heightWeight.bmi = this.bmi;
      this.bloodPressure.systolic = this.frmAddVitals.controls['systolicBp1'].value;
      this.bloodPressure.diastolic = this.frmAddVitals.controls['diastolicBp1'].value;
      this.bloodPressure.location = this.frmAddVitals.controls['diastolicBp1Loc'].value;
      this.bloodPressure.position = this.frmAddVitals.controls['diastolicBp1Pos'].value;

      vitalValue.pulseRate = this.pulseRate;
      vitalValue.respiratoryRate = this.respiratoryRate;
      vitalValue.temperature = this.temperature;
      vitalValue.heightWeight = this.heightWeight;
      vitalValue.bloodPressure = this.bloodPressure;
      this.documentation.facilityId = this.selectedFacility._id;
      this.documentation.patientId = this.selectedAppointment.patientDetails._id;
      this.documentation.createdBy = this.loginedUser._id;
      this.documentation.document = vitalValue;

      this.documentationService.create(this.documentation).then(payload => {
        this.frmAddVitals.reset();
      }, error => {
        console.log(error);
      });
    }
  }
}
