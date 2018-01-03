import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import {
    ProfessionService, RelationshipService, MaritalStatusService, GenderService,
    TitleService, CountriesService, PatientService, PersonService, EmployeeService, FacilitiesService, FacilitiesServiceCategoryService,
    BillingService, ServicePriceService, HmoService
} from '../../../../services/facility-manager/setup/index';
import {
    Facility, FacilityService, Patient, Address, Profession, Relationship, Person,
    Department,
    MinorLocation, Gender, Title, Country
} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { NgUploaderOptions } from 'ngx-uploader';
import { ImageUploaderEnum } from '../../../../shared-module/helpers/image-uploader-enum';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'app-new-patient',
    templateUrl: './new-patient.component.html',
    styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit, AfterViewInit {

    mainErr = true;
    skipNok = false;
    errMsg = 'you have unresolved errors';

    selectedPerson: Person = <Person>{};
    isEmailExist = true;
    apmisId_show = true;
    frmNewPerson1_show = false;
    frmNewPerson2_show = false;
    frmNewPerson3_show = false;
    frmNewEmp4_show = false;
    paymentPlan = false;

    employee: any;
    wallet: boolean;
    insurance: boolean;
    family: boolean;

    coverType:any;

    hmoInsuranceId:any;
    planId:any;

    shouldMoveFirst = false;
    nextOfKinReadOnly = false;

    tabWallet = true;
    tabInsurance = false;
    tabCompany = false;
    tabFamily = false;

    newEmpIdControl = new FormControl('', Validators.required);
    public frmNewEmp1: FormGroup;
    public frmNewEmp2: FormGroup;
    public frmNewEmp3: FormGroup;
    public frmNewEmp4: FormGroup;

    walletPlan = new FormControl('', Validators.required);
    walletPlanCheck = new FormControl('');
    hmoPlan = new FormControl('', Validators.required);
    hmoPlanId = new FormControl('', Validators.required);
    hmoPlanCheck = new FormControl('');
    ccPlan = new FormControl('', Validators.required);
    ccPlanId = new FormControl('', Validators.required);
    ccPlanCheck = new FormControl('');
    familyPlanId = new FormControl('', Validators.required);
    familyPlanCheck = new FormControl('');

    loading:Boolean;

    @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    uploadEvents: EventEmitter<any> = new EventEmitter();

    public events: any[] = []; // use later to display form changes

    empImg: any;
    zone: NgZone;
    cropperSettings: CropperSettings;
    facility: Facility = <Facility>{};
    departments: Department[] = [];
    minorLocations: MinorLocation[] = [];
    genders: Gender[] = [];
    titles: Title[] = [];
    countries: Country[] = [];
    states: any[] = [];
    contactStates: any = [];
    cities: any[];
    lgs: any[] = [];
    cadres: any[] = [];
    maritalStatuses: any[] = [];
    relationships: Relationship[] = [];
    professions: Profession[] = [];
    croppedWidth: number;
    croppedHeight: number;

    person_Id:any;
    planValue:any;

    cashPlans: FacilityService[] = [];
    insurancePlans: any = [];
    planInput: any;

    // ***
    uploadFile: any;
    hasBaseDropZoneOver: Boolean = false;
    options: NgUploaderOptions = {
        url: 'http://localhost:3030/image',
        autoUpload: false,
        data: { filename: '' }
    };
    sizeLimit = 2000000;

    // **
    OperationType: ImageUploaderEnum = ImageUploaderEnum.PersonProfileImage;
    constructor(private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
        private formBuilder: FormBuilder,
        private titleService: TitleService,
        private countryService: CountriesService,
        private genderService: GenderService,
        private maritalStatusService: MaritalStatusService,
        private relationshipService: RelationshipService,
        private professionService: ProfessionService,
        private locker: CoolLocalStorage, private patientService: PatientService,
        private personService: PersonService,
        private employeeService: EmployeeService,
        private facilityService: FacilitiesService,
        private billingService: BillingService, private servicePriceService: ServicePriceService,
        private hmoService: HmoService
    ) {
        // this.uploadEvents = new EventEmitter();
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 400;
        this.cropperSettings.height = 400;
        this.cropperSettings.croppedWidth = 400;
        this.cropperSettings.croppedHeight = 400;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;
        this.cropperSettings.noFileInput = true;

        this.cropperSettings.rounded = false;
        this.cropperSettings.keepAspect = false;

        this.empImg = {};
    }
    cropped(bounds: Bounds) {
        this.croppedHeight = bounds.bottom - bounds.top;
        this.croppedWidth = bounds.right - bounds.left;
    }
    ngAfterViewInit() {
        // this.uploadEvents = new EventEmitter();
    }
    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }
    uploadButton() {
        if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
            if (this.selectedPerson.profileImageObject !== undefined) {
                this.options.data.filename = this.selectedPerson.profileImageObject.filename;
            } else {
                this.options.data.filename = 0;
            }
        }
        this.uploadEvents.emit('startUpload');
    }
    beforeUpload(uploadingFile): void {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            alert('File is too large');
        }
    }
    handleUpload(data): void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            const file = data[0].file;
            if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
                this.personService.get(this.selectedPerson._id, {}).then(payload => {
                    if (payload != null) {
                        payload.profileImageObject = file;
                        this.updatePerson(payload);
                    }
                });
            } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
                this.selectedPerson.profileImageObject = file;
                this.updatePerson(this.selectedPerson);
            }
        }
    }
    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
    updatePerson(person: Person) {
        this.personService.update(person).then(rpayload => {
            if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
                this.selectedPerson = rpayload;
            } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
                this.selectedPerson = rpayload;
            }
            this.close_onClick();
        });
    }

    updatePersonInfo(person?: Person, id?){
        /* const person: Person = <Person>{ nextOfKin: [] };
        person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value;
        person.email = this.frmNewEmp1.controls['empEmail'].value;
        person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
        person.genderId = this.frmNewEmp1.controls['empGender'].value;
        person.homeAddress = <Address>{
            street: this.frmNewEmp2.controls['empHomeAddress'].value,
            city: this.frmNewEmp2.controls['empCity'].value,
            // lga: this.frmNewEmp1.controls["empLga"].value,
            country: this.frmNewEmp2.controls['empCountry'].value,
            state: this.frmNewEmp2.controls['empContactState'].value

        }
        person.lastName = this.frmNewEmp1.controls['empLastName'].value;
        person.maritalStatusId = this.frmNewEmp2.controls['empMaritalStatus'].value;
        if (!this.skipNok) {
            console.log('not skip');
            person.nextOfKin.push(
                { 
                    fullName: this.frmNewEmp3.controls['nok_fullname'].value,
                    address: this.frmNewEmp3.controls['nok_Address'].value,
                    phoneNumber: this.frmNewEmp3.controls['nok_phoneNo'].value,
                    email: this.frmNewEmp3.controls['nok_email'].value,
                    relationship: this.frmNewEmp3.controls['nok_relationship'].value,

                }
            );
        }

            person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
            person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
            person.titleId = this.frmNewEmp1.controls['empTitle'].value;
            person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
            person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
            person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value; */
        this.personService.get(id, {}).then(payloads => {

            console.log(payloads);            
            
            /* this.personService.update(person).then(rpayload => {

            }); */
        });
    }

    previewFile() {
        // this.selectedPerson.profileImage = this.empImg.image;
        // this.updatePerson(this.selectedPerson);
    }

    ngOnInit() {

        // this.uploadEvents = new EventEmitter();
        this.facility = <Facility>this.locker.getObject('selectedFacility');
        this.departments = this.facility.departments;
        this.minorLocations = this.facility.minorLocations;
        this.newEmpIdControl.valueChanges.subscribe(value => {
            // do something with value here
        });

        // facilityId: this.facility._id,
        // "employeeDetails.apmisId": this.ccPlanId.value
        /* const away = this.ccPlanId.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term: any) => this.employeeService.searchEmployee(this.facility._id, this.ccPlanId.value, false));

        away.subscribe((payload: any) => {
            console.log(this.ccPlanId.value);
            console.log(payload);
        }); */

        const insur = this.hmoPlanId.valueChanges
        .debounceTime(400)
        .distinctUntilChanged()
        .switchMap((term:any) => this.hmoService.find({
            query: {
                facilityId: this.facility._id
            }
        }));
        insur.subscribe((payload: any) => {
            console.log(payload);
        });

        this.frmNewEmp1 = this.formBuilder.group({

            empTitle: ['', [<any>Validators.required]],
            empFirstName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empOtherNames: ['', [<any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empLastName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empGender: ['', [<any>Validators.required]],
            empPersonId: [''],
            empNationality: ['', [<any>Validators.required]],
            empState: ['', [<any>Validators.required]],
            empLga: ['', [<any>Validators.required]],
            empEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            confirmEmpEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            empPhonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]

        });
        this.frmNewEmp1.controls['empNationality'].valueChanges.subscribe((value: Country) => {
            this.states = value.states;
        });

        this.frmNewEmp1.controls['empState'].valueChanges.subscribe((value: any) => {
            this.lgs = value.lgs;
        });

        this.frmNewEmp2 = this.formBuilder.group({

            empMaritalStatus: ['', [<any>Validators.required]],
            empCountry: ['', [<any>Validators.required]],
            empContactState: ['', [<any>Validators.required]],
            empCity: ['', [<any>Validators.required]],
            empHomeAddress: ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(100)]],
            empDOB: [new Date(), [<any>Validators.required]],
            secQst: ['', []],
            secAns: ['', []]

        });
        this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
            this.contactStates = value.states;
        });
        this.frmNewEmp2.controls['empContactState'].valueChanges.subscribe((value) => {
            this.cities = value.cities;
        });
        this.frmNewEmp3 = this.formBuilder.group({

            nok_fullname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            nok_apmisID: [''],
            nok_relationship: ['', [<any>Validators.required]],
            nok_email: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            nok_phoneNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
            nok_Address: ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(100)]]
        });

        const apmisIdObs = this.frmNewEmp3.controls['nok_apmisID'].valueChanges.debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term: Person[]) => this.personService.find({
                query: {
                    apmisId: this.frmNewEmp3.controls['nok_apmisID'].value.toUpperCase()
                }
            }));
        apmisIdObs.subscribe((payload: any) => {
            if (payload.data.length > 0) {
                const person = payload.data[0];
                this.frmNewEmp3.controls['nok_Address'].setValue(person.fullAddress);
                this.frmNewEmp3.controls['nok_email'].setValue(person.email);
                this.frmNewEmp3.controls['nok_fullname'].setValue(person.personFullName);
                this.frmNewEmp3.controls['nok_phoneNo'].setValue(person.phoneNumber);
                this.nextOfKinReadOnly = true;
            } else {
                this.frmNewEmp3.controls['nok_Address'].reset();
                this.frmNewEmp3.controls['nok_email'].reset();
                this.frmNewEmp3.controls['nok_fullname'].reset();
                this.frmNewEmp3.controls['nok_phoneNo'].reset();
                this.nextOfKinReadOnly = false;
            }
        });

        this.frmNewEmp4 = this.formBuilder.group({

            empDept: ['', [<any>Validators.required]],
            empLoc: ['', [<any>Validators.required]],
            empWorkEmail: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            empWorkPhonNo: ['', [<any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
            empJobTitle: ['', [<any>Validators.required]],
            empLevel: ['', [<any>Validators.required]]

        });
        this.frmNewEmp4.controls['empJobTitle'].valueChanges.subscribe((value) => {
            this.cadres = value.caders;
        });
        this.getCountries();
        this.getTitles();
        this.getGenders();
        this.getMaritalStatus();
        this.getRelationships();
        this.getProfessions();

        this.frmNewEmp1.controls['empEmail'].valueChanges.subscribe(value => {
            this.onCheckEmailAddress(value);
        });

        this.zone = new NgZone({ enableLongStackTrace: false });

        this.getCashPlans();
    }

    getCashPlans() {
        this._facilitiesServiceCategoryService.find({
            query:
                { searchCategory: "Medical Records", facilityId: this.facility._id }
        }).then(payload => {
            //this.filterOutCategory(payload);
            //this.categories = [];
            let cat: any = [];
            payload.data.forEach((itemi, i) => {
                itemi.categories.forEach((itemj, j) => {
                    if (itemi.facilityId !== undefined) {
                        cat.push(itemj);
                        this.cashPlans = cat[0].services;
                    }
                });
            });
            console.log(this.cashPlans);
        });
    }

    employeeChecking(value) {
        /* this.employeeService.find({
            query : {
                facilityId: this.facility._id,
                _id: value
            }
        }).then(payload => {
        }); */
    }

    next(data) {
        if (this.paymentPlan === true) {
            this.planInput = data;
            this.frmNewEmp4_show = false;
            this.frmNewPerson1_show = true;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.paymentPlan = false;
        }
    }

    nextCompanyCover(){
        this.loading = true;
        this.hmoInsuranceId = this.frmNewEmp1.controls['hmoPlanId'].value();
        this.planId = this.frmNewEmp1.controls['hmoPlan'].value();
        this.coverType = 'company';

        this.employeeService.searchEmployee(this.facility._id, this.ccPlanId.value, false).then(de => {
            let data = de.body["0"].employeeDetails;
            this.person_Id = de.body[0].personId;

            
            this.frmNewEmp1.controls['empFirstName'].setValue(data.firstName);
            this.frmNewEmp1.controls['empLastName'].setValue(data.lastName);
            this.frmNewEmp1.controls['empEmail'].setValue(data.email);
            this.frmNewEmp1.controls['confirmEmpEmail'].setValue(data.email);
            this.frmNewEmp1.controls['empPhonNo'].setValue(data.phoneNumber);
            
                this.planInput = data;
                this.frmNewEmp4_show = false;
                this.frmNewPerson1_show = true;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.paymentPlan = false;
                this.employee = true;

                this.loading = false;
            

        }).catch(err => {
            console.log(err);
        });

    }

    nextInsuranceCover(hmoPlanId, hmoPlan){
        this.loading = true;
        this.hmoInsuranceId = hmoPlanId;
        this.planId = hmoPlan;
        this.insurance = true;
        this.coverType = 'insurance';

        console.log(this.hmoInsuranceId, this.planId);

        this.hmoService.getEnrollee(this.hmoInsuranceId).then(de => {
            let data = de.data/* .body["0"].employeeDetails */;
            console.log(data);
            //this.person_Id = de.body[0].personId;

            //this.frmNewEmp1.controls['empPersonId'].setValue(de.body[0].personId);
            this.frmNewEmp1.controls['empFirstName'].setValue(data.enrollees.firstName);
            this.frmNewEmp1.controls['empLastName'].setValue(data.enrollees.lastName);
            this.frmNewEmp1.controls['empGender'].setValue(data.enrollees);
            this.frmNewEmp1.controls['hmoId'].setValue(data.hmoId);
            this.frmNewEmp1.controls['hmoName'].setValue(data.hmoName);
            
                /* this.planInput = data; */
                this.frmNewEmp4_show = false;
                this.frmNewPerson1_show = true;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.paymentPlan = false;
                

                this.loading = false;
            

        }).catch(err => {
            console.log(err);
        });

    }

    getProfessions() {
        this.professionService.findAll().then(payload => {
            this.professions = payload.data;
        }).catch(err => {

        });
    }
    getRelationships() {
        this.relationshipService.findAll().then(payload => {
            this.relationships = payload.data;
        }).catch(err => {

        });;
    }
    getMaritalStatus() {
        this.maritalStatusService.findAll().then(payload => {
            this.maritalStatuses = payload.data;
        }).catch(err => {

        });;
    }
    getGenders() {
        this.genderService.findAll().then(payload => {
            this.genders = payload.data;
        }).catch(err => {

        });
    }
    getTitles() {
        this.titleService.findAll().then(payload => {
            this.titles = payload.data;
        }).catch(err => {

        });
    }
    getCountries() {
        this.countryService.findAll().then(payload => {
            this.countries = payload.data;
        }).catch(err => {

        });
    }
    empApmisID() {
        // validate apimisID

        Observable.fromPromise(this.personService.find({
            query: { apmisId: this.newEmpIdControl.value.toUpperCase() }
        })).mergeMap((person: any) => {
            if (person.data.length > 0) {
                this.selectedPerson = person.data[0];
                return Observable.fromPromise(this.employeeService.find({ query: { personId: this.selectedPerson._id } }));
            } else {
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
                return Observable.of(undefined);
            }


        }).subscribe((result: any) => {
            if (result === undefined) {
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
            } else if (result.data.length > 0) {
                this.errMsg = 'This APMIS ID is valid or has been previously used to generate an employee!';
                this.mainErr = false;
            } else {
                this.frmNewEmp4_show = false;
                this.apmisId_show = true;
                this.mainErr = true;
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.paymentPlan = false;
                this.shouldMoveFirst = true;
            }
        });


        // Observable.forkJoin([findPerson$, findPersonInFacilityEmployee$]).subscribe(results => {
        // });

        // this.personService.find({
        //     query: { apmisId: this.newEmpIdControl.value.toUpperCase() }
        // }).then(payload => {
        //     if (payload.data.length > 0) {
        //         this.selectedPerson = payload.data[0];
        //         //validate duplicate employee registration with facility
        //         this.employeeService.find({
        //             query: { facilityId: this.facility._id, personId: this.selectedPerson._id }
        //         }).then(innerPayload => {
        //             if (innerPayload.data.length === 0) {
        //                 this.frmNewEmp4_show = true;
        //                 this.apmisId_show = false;
        //                 this.mainErr = true;
        //                 this.frmNewEmp4_show = true;
        //                 this.frmNewPerson1_show = false;
        //                 this.frmNewPerson2_show = false;
        //                 this.frmNewPerson3_show = false;
        //                 this.apmisId_show = false;
        //                 this.mainErr = true;
        //             }
        //         });
        //     } else {
        //         this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
        //         this.mainErr = false;
        //     }
        // });
    }
    back_empApmisID() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.paymentPlan = false;
        this.apmisId_show = true;
        this.mainErr = true;
    }

    newPerson1_show() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.paymentPlan = true;
        this.apmisId_show = false;
        this.shouldMoveFirst = false;
    }
    newPerson1(valid, val) {
        this.uploadEvents = new EventEmitter();
        if (valid) {
            if (val.empTitle === '' || val.empTitle === ' ' || val.empFirstName === ''
                || val.empFirstName === ' ' || val.empLastName === '' || val.empLastName === ' '
                || val.empPhonNo === ' ' || val.empPhonNo === '' || val.empGender === '' || val.empNationality === ''
                || val.empLga === '' || val.empState === '') {
                this.mainErr = false;
                this.errMsg = 'you left out a required field';
            } else {
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = true;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = false;
                this.paymentPlan = false;
                this.apmisId_show = false;
                this.mainErr = true;

            }
        } else {
            this.mainErr = false;
        }

    }

    back_newPerson1() {
        this.frmNewPerson1_show = true;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.paymentPlan = false;
        this.apmisId_show = false;
        this.mainErr = true;
    }

    newPerson2(valid, val) {
        if (valid) {
            if (val.empMaritalStatus === '' || val.empHomeAddress === ' ' || val.empHomeAddress === '' || val.empDOB === ' ') {
                this.mainErr = false;
                this.errMsg = 'you left out a required field';
            } else {

                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = true;
                this.frmNewEmp4_show = false;
                this.paymentPlan = false;
                this.apmisId_show = false;
                this.mainErr = true;

            }
        } else {
            this.mainErr = false;
        }

    }
    back_newPerson2() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = true;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.paymentPlan = false;
        this.apmisId_show = false;
        this.mainErr = true;
    }

    savePerson() {
            const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.genderId = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value,
                state: this.frmNewEmp2.controls['empContactState'].value

            }
            person.lastName = this.frmNewEmp1.controls['empLastName'].value;
            person.maritalStatusId = this.frmNewEmp2.controls['empMaritalStatus'].value;
            if (!this.skipNok) {
                person.nextOfKin.push(
                    { 
                        fullName: this.frmNewEmp3.controls['nok_fullname'].value,
                        address: this.frmNewEmp3.controls['nok_Address'].value,
                        phoneNumber: this.frmNewEmp3.controls['nok_phoneNo'].value,
                        email: this.frmNewEmp3.controls['nok_email'].value,
                        relationship: this.frmNewEmp3.controls['nok_relationship'].value,

                    }
                );

                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            } else {
                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            }
            let patient: any = {
                personId: this.person_Id,
                facilityId: this.facility._id,
                paymentPlan: [
                    {
                        planType: 'wallet',
                        isDefault: true
                    }
                ]
            }

            this.personService.create(person).then(personPayload => {
                console.log(personPayload);
                this.patientService.create(patient).then(payl => {
                    // this.uploadButton();
                    this.servicePriceService.find({ query: { facilityId: this.facility._id, serviceId: this.planInput } }).then(payloadPrice => {
                    
                        //this.prices = payload.data;
                        console.log(payloadPrice.data);
                        let servicePrice = payloadPrice.data[0];
                        let billing:any = {
                            discount: 0,
                            facilityId: this.facility._id,
                            grandTotal: servicePrice.price,
                            patientId: payl._id,
                            subTotal: servicePrice.price,
                            billItems: [
                                {
                                    unitPrice: servicePrice.price,
                                    facilityId: this.facility._id,
                                    description: "",
                                    facilityServiceId: servicePrice.facilityServiceId,
                                    serviceId: this.planInput,
                                    patientId: payl._id,
                                    quantity: 1,
                                    totalPrice: servicePrice.price,
                                    unitDiscountedAmount: 0,
                                    totalDiscoutedAmount: 0,
                                    modifierId: [],
                                    covered: {
                                        coverType: this.coverType
                                    },
                                    isServiceEnjoyed: false,
                                    paymentCompleted: false,
                                    paymentStatus: [],
                                    payments: []
                                    
                                }
                            ]
                        }
                        this.billingService.create(billing).then(billingPayload => {
                            console.log(billingPayload);
                            this.close_onClick();
                        }).catch(errr => {
                            console.log(errr);
                        });
                
                    }).catch(err => {
                        console.log(err);
                    });

                });
            });
    }

    saveCompanyPerson(){
        const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.genderId = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value,
                state: this.frmNewEmp2.controls['empContactState'].value

            }
            person._id = this.person_Id;
            person.lastName = this.frmNewEmp1.controls['empLastName'].value;
            person.maritalStatusId = this.frmNewEmp2.controls['empMaritalStatus'].value;
            if (!this.skipNok) {
                person.nextOfKin.push(
                    { 
                        fullName: this.frmNewEmp3.controls['nok_fullname'].value,
                        address: this.frmNewEmp3.controls['nok_Address'].value,
                        phoneNumber: this.frmNewEmp3.controls['nok_phoneNo'].value,
                        email: this.frmNewEmp3.controls['nok_email'].value,
                        relationship: this.frmNewEmp3.controls['nok_relationship'].value,

                    }
                );

                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;

                /* console.log(planValue);
                this.planInput = planValue; */
                
            }else{
                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            }

            let facId = this.frmNewEmp1.controls['facId'].value;
            let facName = this.frmNewEmp1.controls['facName'].value;

            let patient: any = {
                personId: this.person_Id,
                facilityId: this.facility._id,
                paymentPlan: [
                    {
                        planType: 'wallet',
                        isDefault: true
                    },
                    {
                        planType: 'company',
                        isDefault: false,
                        planDetails: {
                            name: facName,
                            _id: facId
                        }
                    }
                ]
            }

            this.personService.update(person).then(personPayload => {
                console.log(personPayload);
                this.patientService.create(patient).then(payl => {
                    // this.uploadButton();
                    this.servicePriceService.find({ query: { facilityId: this.facility._id, serviceId: this.planInput } }).then(payloadPrice => {
                    
                        //this.prices = payload.data;
                        console.log(payloadPrice.data);
                        let servicePrice = payloadPrice.data[0];
                        let billing:any = {
                            discount: 0,
                            facilityId: this.facility._id,
                            grandTotal: servicePrice.price,
                            patientId: payl._id,
                            subTotal: servicePrice.price,
                            billItems: [
                                {
                                    unitPrice: servicePrice.price,
                                    facilityId: this.facility._id,
                                    description: "",
                                    facilityServiceId: servicePrice.facilityServiceId,
                                    serviceId: this.planInput,
                                    patientId: payl._id,
                                    quantity: 1,
                                    totalPrice: servicePrice.price,
                                    unitDiscountedAmount: 0,
                                    totalDiscoutedAmount: 0,
                                    modifierId: [],
                                    covered: {
                                        coverType: this.coverType,
                                        _id: facId,
                                        name: facName
                                    },
                                    isServiceEnjoyed: false,
                                    paymentCompleted: false,
                                    paymentStatus: [],
                                    payments: []
                                    
                                }
                            ]
                        }
                        this.billingService.create(billing).then(billingPayload => {
                            console.log(billingPayload);
                            this.close_onClick();
                        }).catch(errr => {
                            console.log(errr);
                        });
                
                    }).catch(err => {
                        console.log(err);
                    });

                });
            });
    }

    saveInsurancePerson(){
        const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.genderId = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value,
                state: this.frmNewEmp2.controls['empContactState'].value

            }
            person._id = this.person_Id;
            person.lastName = this.frmNewEmp1.controls['empLastName'].value;
            person.maritalStatusId = this.frmNewEmp2.controls['empMaritalStatus'].value;
            if (!this.skipNok) {
                person.nextOfKin.push(
                    { 
                        fullName: this.frmNewEmp3.controls['nok_fullname'].value,
                        address: this.frmNewEmp3.controls['nok_Address'].value,
                        phoneNumber: this.frmNewEmp3.controls['nok_phoneNo'].value,
                        email: this.frmNewEmp3.controls['nok_email'].value,
                        relationship: this.frmNewEmp3.controls['nok_relationship'].value,

                    }
                );

                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;

                /* console.log(planValue);
                this.planInput = planValue; */
            }else{
                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            }

            let facId = this.frmNewEmp1.controls['facId'].value;
            let facName = this.frmNewEmp1.controls['facName'].value;

            let patient: any = {
                personId: this.person_Id,
                facilityId: this.facility._id,
                paymentPlan: [
                    {
                        planType: 'wallet',
                        isDefault: true
                    },
                    {
                        planType: 'insurance',
                        isDefault: false,
                        planDetails: {
                            name: facName,
                            _id: facId
                        }
                    }
                ]
            }

            this.personService.create(person).then(personPayload => {
                console.log(personPayload);
                this.patientService.create(patient).then(payl => {
                    // this.uploadButton();
                    this.servicePriceService.find({ query: { facilityId: this.facility._id, serviceId: this.planInput } }).then(payloadPrice => {
                    
                        //this.prices = payload.data;
                        console.log(payloadPrice.data);
                        let servicePrice = payloadPrice.data[0];
                        let billing:any = {
                            discount: 0,
                            facilityId: this.facility._id,
                            grandTotal: servicePrice.price,
                            patientId: payl._id,
                            subTotal: servicePrice.price,
                            billItems: [
                                {
                                    unitPrice: servicePrice.price,
                                    facilityId: this.facility._id,
                                    description: "",
                                    facilityServiceId: servicePrice.facilityServiceId,
                                    serviceId: this.planInput,
                                    patientId: payl._id,
                                    quantity: 1,
                                    totalPrice: servicePrice.price,
                                    unitDiscountedAmount: 0,
                                    totalDiscoutedAmount: 0,
                                    modifierId: [],
                                    covered: {
                                        coverType: this.coverType,
                                        _id: facId,
                                        name: facName
                                    },
                                    isServiceEnjoyed: false,
                                    paymentCompleted: false,
                                    paymentStatus: [],
                                    payments: []
                                    
                                }
                            ]
                        }
                        this.billingService.create(billing).then(billingPayload => {
                            console.log(billingPayload);
                            this.close_onClick();
                        }).catch(errr => {
                            console.log(errr);
                        });
                
                    }).catch(err => {
                        console.log(err);
                    });

                });
            });
    }

    saveData(){
        if(this.insurance === true){
            this.saveInsurancePerson();
        }else if(this.employee === true){
            this.saveCompanyPerson();
        }else if(this.wallet === true){
            this.savePerson();
        }else if(this.family === true){}
    }



    newPerson3(valid, val) {
        if (this.skipNok || valid) {
            if (this.skipNok) {
                this.saveData();
            } else {
                if (valid) {
                    if (val.nok_fullname === '' || val.nok_fullname === ' ' || val.nok_relationship === ''
                        || val.nok_relationship === ' ' || val.nok_phoneNo === ' ' || val.nok_phoneNo === ''
                        || val.nok_Address === ' ' || val.nok_Address === '') {
                        this.mainErr = false;
                        this.errMsg = 'you left out a required field';
                    } else {
                        this.mainErr = true;
                        this.saveData();
                        // this.closeModal.emit(true);
                    }
                } else {
                    this.mainErr = false;
                }
            }
        }
    }

    skip_nok() {
        // this.frmNewPerson1_show = false;
        // this.frmNewPerson2_show = false;
        // this.frmNewPerson3_show = false;
        // this.frmNewEmp4_show = true;
        this.apmisId_show = false;
        this.mainErr = true;
        this.skipNok = true;
        this.saveData();
    }

    back_newPerson3() {
        if (this.shouldMoveFirst === true) {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.frmNewEmp4_show = false;
            this.paymentPlan = false;
            this.apmisId_show = true;
            this.mainErr = true;
        } else {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = true;
            this.frmNewEmp4_show = false;
            this.paymentPlan = false;
            this.apmisId_show = false;
            this.mainErr = true;
        }
    }

    saveEmployee() {
        let model: Patient = <Patient>{};
        model.facilityId = this.facility._id;
        model.personId = this.selectedPerson._id;
        model.personDetails = this.selectedPerson;

        this.patientService.create(model).then(payload => {
            this.facilityService.announceNotification({
                type: 'Success',
                text: this.selectedPerson.personFullName + ' added successfully',
                users: [this.facilityService.getLoginUserId()]
            })
            this.close_onClick();
            this.paymentPlan = false;
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.frmNewEmp4_show = false;
            this.apmisId_show = false;
        }, error => {
            if (this.shouldMoveFirst !== true) {
                this.personService.remove(this.selectedPerson._id, {}).subscribe(payload => {
                    this.facilityService.announceNotification({
                        type: 'Error',
                        text: 'An error has occured preventing this operation to be successful!'
                    });
                });
            } else {

            }

        });
    }
    newEmp4(valid, val) {
        this.saveEmployee();
    }
    payplans() {
        this.paymentPlan = false;
        this.frmNewPerson1_show = true;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.apmisId_show = false;
    }
    back_payplans() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.paymentPlan = true;
        this.apmisId_show = false;
        this.mainErr = true;
    }

    onEmpTitleChange(val) { }
    onEmpGenderChange(val) { }
    onEmpNationalityChange(val: Country) {
    }
    onEmpStateChange(val) { }
    onEmpLgaChange(val) { }
    onEmpMaritalStatusChange(val) { }
    onEmpDeptChange(val) { }
    onEmpLocChange(val) { }
    onNokRelationshipChange(val) { }
    onEmpJobTitleChange(val) { }
    onEmpLevelChange(val) { }

    onCheckEmailAddress(value) {
        this.personService.find({ query: { email: value } }).then(payload => {
            if (payload.data.length > 0) {
                this.isEmailExist = false;
            } else {
                this.isEmailExist = true;
            }
        }).catch(error => {
        });
    }

    close_onClick() {
        this.closeModal.emit(true);
        // this.facilityService.announceNotification({
        //     type: 'Info',
        //     text: 'This operation has been canceled!'
        // });
    }

    tabWallet_click() {
        this.tabWallet = true;
        this.tabCompany = false;
        this.tabFamily = false;
        this.tabInsurance = false;
    }
    tabCompany_click() {
        this.tabWallet = false;
        this.tabCompany = true;
        this.tabFamily = false;
        this.tabInsurance = false;
    }
    tabFamily_click() {
        this.tabWallet = false;
        this.tabCompany = false;
        this.tabFamily = true;
        this.tabInsurance = false;
    }
    tabInsurance_click() {
        this.tabWallet = false;
        this.tabCompany = false;
        this.tabFamily = false;
        this.tabInsurance = true;
    }

}
