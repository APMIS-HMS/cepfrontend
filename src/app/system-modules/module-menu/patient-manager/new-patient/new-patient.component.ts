import { SecurityQuestionsService } from 'app/services/facility-manager/setup/security-questions.service';
import { TitleCasePipe } from '@angular/common';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FacilityFamilyCoverService } from './../../../../services/facility-manager/setup/facility-family-cover.service';
import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import {
    ProfessionService, RelationshipService, MaritalStatusService, GenderService,
    TitleService, CountriesService, PatientService, PersonService, EmployeeService, FacilitiesService, FacilitiesServiceCategoryService,
    BillingService, ServicePriceService, HmoService, FamilyHealthCoverService
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
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX, HTML_SAVE_PATIENT } from 'app/shared-module/helpers/global-config';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';

@Component({
    selector: 'app-new-patient',
    templateUrl: './new-patient.component.html',
    styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit, AfterViewInit {
    user: any;
    securityQuestions: any[] = [];

    isSuccessful = false;
    isSaving = false;
    validating = false;
    duplicate = false;
    mainErr = true;
    skipNok = false;
    errMsg = 'you have unresolved errors';

    selectedPerson: Person = <Person>{};
    selectedFamilyCover: any = <any>{};
    isEmailExist = true;
    apmisId_show = true;
    frmNewPerson1_show = false;
    frmNewPerson2_show = false;
    frmNewPerson3_show = false;
    frmNewEmp4_show = false;
    paymentPlan = false;

    categories;
    services;
    servicePricePlans;

    beneficiaries;

    /* employee: any;
    wallet: boolean;
    insurance: boolean; */
    family: any;
    coverType: any;
    hmoInsuranceId: any;
    ccEmployeeId: any;
    faId: any;
    planId: any;

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
    public frmPerson: FormGroup;

    walletPlanPrice = new FormControl('', Validators.required);
    walletPlan = new FormControl('', Validators.required);
    walletPlanCheck = new FormControl('');
    insuranceId = new FormControl('', Validators.required);
    hmoPlan = new FormControl('', Validators.required);
    hmoPlanId = new FormControl('', Validators.required);
    hmoPlanPrice = new FormControl('', Validators.required);
    hmoPlanCheck = new FormControl('');
    ccPlan = new FormControl('', Validators.required);
    ccPlanId = new FormControl('', Validators.required);
    ccPlanCheck = new FormControl('');
    familyPlanId = new FormControl('', Validators.required);
    familyPlanCheck = new FormControl('');
    faPlanPrice = new FormControl('');
    faPlan = new FormControl('');

    loading: Boolean;

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

    person_Id: any;
    planValue: any;

    cashPlans: FacilityService[] = [];
    insurancePlans: any = [];
    planPrice: any;
    facilityServiceId: any;

    hmos;
    hmo;
    filteredHmos: Observable<any[]>;

    planDetails: any;

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
        private hmoService: HmoService,
        private systemModuleService: SystemModuleService,
        private titleCasePipe: TitleCasePipe,
        private securityQuestionService: SecurityQuestionsService,
        private faService: FamilyHealthCoverService,
        private authFacadeService: AuthFacadeService,
        private familyCoverService: FacilityFamilyCoverService
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

        this.filteredHmos = this.hmoPlanId.valueChanges
            .pipe(
                startWith(''),
                map((hmo: any) => hmo ? this.filterHmos(hmo) : this.hmos.slice())
            );
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

    updatePersonInfo(person?: Person, id?) {
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
            person.title = this.frmNewEmp1.controls['empTitle'].value;
            person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
            person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
            person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value; */
        this.personService.get(id, {}).then(payloads => {

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
        this.authFacadeService.getLogingUser().then(payload => {
            this.user = payload;
        })
        this.facility = <Facility>this.locker.getObject('selectedFacility');
        this.departments = this.facility.departments;
        this.minorLocations = this.facility.minorLocations;
        this.newEmpIdControl.valueChanges.subscribe(value => {
            // do something with value here
        });
        this.frmPerson = this.formBuilder.group({
            persontitle: [new Date(), [<any>Validators.required]],
            firstname: ['', [<any>Validators.required,
                <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            lastname: ['', [<any>Validators.required,
                <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            gender: [[<any>Validators.minLength(2)]],
            dob: [new Date(), [<any>Validators.required]],
            motherMaidenName: ['', [<any>Validators.required,
                <any>Validators.minLength(3), <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            // securityQuestion: ['', [<any>Validators.required]],
            // securityAnswer: ['', [<any>Validators.required]],
            // email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
            phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]]
        });


        this.frmPerson.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.errMsg = '';
                this.mainErr = true;
                this.validating = true;
                this.personService.searchPerson({
                    query: {
                        firstName: value.firstname,
                        lastName: value.lastname,
                        primaryContactPhoneNo: value.phone,
                        motherMaidenName: value.motherMaidenName,
                        isValidating: true
                    }
                }).then(payload => {
                    this.validating = false;
                    if (payload.status === 'success') {
                        this.duplicate = true;
                        this.errMsg = 'Duplicate record detected, please check and try again!';
                        this.mainErr = false;
                    } else {
                        this.duplicate = false;
                    }
                }, error => {
                });
            });

        this.gethmos();
        this.getCategories();

        this.frmNewEmp1 = this.formBuilder.group({

            empTitle: ['', [<any>Validators.required]],
            empFirstName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empOtherNames: ['', [<any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empLastName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empGender: ['', [<any>Validators.required]],
            empPersonId: [''],
            facId: [''],
            facName: [''],
            ffId: [''],
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
        this.frmNewEmp4.controls['empJobTitle'].valueChanges.subscribe((value: Profession) => {
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

        this.getSecurityQuestions();
    }

    getCashPlans() {
        this._facilitiesServiceCategoryService.find({
            query:
                { facilityId: this.facility._id, 'categories.name': 'Medical Records', $select: { 'categories.$': 1}  }
        }).then(payload => {
            // this.filterOutCategory(payload);
            // this.categories = [];
            const cat: any = [];
            payload.data.forEach((itemi, i) => {
                itemi.categories.forEach((itemj, j) => {
                    cat.push(itemj);
                    this.cashPlans = cat[0].services;
                });
            });
        });
    }

    getCategories() {
        this._facilitiesServiceCategoryService.allServices({
            query: {
                facilityId: this.facility._id
            }
        }).then(payload => {
            this.categories = payload.data[0].categories;
            const cat = this.categories.filter(x => x.name === 'Medical Records');
            for (let n = 0; n < cat[0].services.length; n++) {
                cat[0].services[n].facilityServiceId = payload.data[0]._id
            }
            this.services = cat[0].services;
        }, error => {
            /* this.systemModuleService.off(); */
        });
    }

    getFamilyBeneficiaryList() {
        this.familyCoverService.find({ query: { 'facilityId': this.facility._id } }).then(payload => {
            console.log(payload);
            if (payload.data.length > 0) {
                const facFamilyCover = payload.data[0];
                this.selectedFamilyCover = facFamilyCover;
                this.beneficiaries = facFamilyCover.familyCovers;
                console.log(this.beneficiaries);
            }
        })
    }

    getServicePlans(service) {
        this.servicePricePlans = service.price;
    }

    validatingPerson() {
        return this.validating || this.duplicate;
    }
    getSecurityQuestions() {
        this.securityQuestionService.find({})
            .then(payload => {
                this.securityQuestions = payload.data;
            }, error => {

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

    next() {
        this.coverType = 'wallet';
        if (this.selectedPerson !== undefined && this.selectedPerson._id !== undefined) {
            if (this.paymentPlan === true) {
                this.planPrice = this.walletPlanPrice.value;
                this.planId = this.walletPlan.value._id;
                this.facilityServiceId = this.walletPlan.value.facilityServiceId;
                this.paymentPlan = false;
                this.coverType = 'wallet';
                this.saveData();
            }
        } else {
            if (this.paymentPlan === true) {
                this.planPrice = this.walletPlanPrice.value;
                this.planId = this.walletPlan.value._id;
                this.facilityServiceId = this.walletPlan.value.facilityServiceId;
                this.frmNewEmp4_show = false;
                this.frmNewPerson1_show = true;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.paymentPlan = false;
                this.coverType = 'wallet';
            }
        }

    }

    nextCompanyCover(ccPlanId, ccPlan) {
        this.loading = true;
        this.ccEmployeeId = ccPlanId;
        this.planPrice = ccPlan;
        this.coverType = 'company';

        this.employeeService.searchEmployee(this.facility._id, this.ccEmployeeId, false).then(de => {
            const data = de.body['0'].employeeDetails;
            this.person_Id = de.body[0].personId;


            this.frmNewEmp1.controls['empFirstName'].setValue(data.firstName);
            this.frmNewEmp1.controls['empLastName'].setValue(data.lastName);
            this.frmNewEmp1.controls['empEmail'].setValue(data.email);
            this.frmNewEmp1.controls['confirmEmpEmail'].setValue(data.email);
            this.frmNewEmp1.controls['empPhonNo'].setValue(data.phoneNumber);
            this.frmNewEmp1.controls['empPersonId'].setValue(de.body[0].personId);


            this.frmNewEmp4_show = false;
            this.frmNewPerson1_show = true;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.paymentPlan = false;
            // this.employee = true;

            this.loading = false;


        }).catch(err => {
        });

    }

    gethmos() {
        this.hmoService.getHmos({
            query: {
                facilityId: this.facility._id
            }
        }).then(payload => {
            this.hmos = payload;
        }).catch(err => {
        });
    }

    filterHmos(val: any) {
        if (val.hmoName === undefined) {
            return this.hmos.filter(hmo =>
                hmo.hmoName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.hmos.filter(hmo =>
                hmo.hmoName.toLowerCase().indexOf(val.hmoName.toLowerCase()) === 0);
        }
    }

    displayFn(hmo: any): string {
        return hmo ? hmo.hmoName : hmo;
    }
    nextInsuranceCover(hmoPlanId, hmoPlan) {
        this.systemModuleService.on();

        this.coverType = 'insurance';
        this.hmo = this.hmoPlanId.value;
        const insuranceId = this.insuranceId.value;
        this.hmoInsuranceId = insuranceId;
        this.planPrice = this.hmoPlanPrice.value;
        this.planId = this.hmoPlan.value._id;
        this.facilityServiceId = this.hmoPlan.value.facilityServiceId;

        this.hmoService.find({ query: { 'facilityId': this.facility._id } }).then(payload => {
            if (payload.data.length > 0) {
                const facHmo = payload.data[0];
                const index = facHmo.hmos.findIndex(x => x.hmo === this.hmo.hmoId);
                if (index > -1) {
                    if (facHmo.hmos[index].enrolleeList.length > 0) {
                        const bene = [];
                        for (let s = 0; s < facHmo.hmos[index].enrolleeList.length; s++) {
                            const hmo = facHmo.hmos[index].hmo;
                            bene.push(...facHmo.hmos[index].enrolleeList[s].enrollees);
                        }
                        const fil = bene.filter(x => x.filNo === insuranceId);
                        if (fil.length > 0) {
                            if (fil[0].status === false) {
                                this.systemModuleService.off();
                                this.systemModuleService
                                .announceSweetProxy('Insurance Id does not have an active status for the selected HMO', 'error');
                            } else {
                                if (this.shouldMoveFirst === true) {
                                    this.saveInsurancePerson();
                                } else {
                                    this.systemModuleService.off();
                                    this.frmNewEmp4_show = false;
                                    this.frmNewPerson1_show = true;
                                    this.frmNewPerson2_show = false;
                                    this.frmNewPerson3_show = false;
                                    this.paymentPlan = false;
                                    this.loading = false;
                                }
                            }
                        } else {
                            this.systemModuleService.off();
                            this.systemModuleService
                            .announceSweetProxy('Insurance Id does not exist for the selected HMO', 'error');
                        }
                    }
                }
            }
        }).catch(err => { console.log(err) });
    }

    nextFamilyCover() {
        this.loading = true;

        this.coverType = 'family';
        this.faId = this.familyPlanId.value;
        this.planPrice = this.faPlanPrice.value;
        this.planId = this.faPlan.value._id;
        this.facilityServiceId = this.faPlan.value.facilityServiceId;

        if (this.getRole(this.faId) !== 'P') {
            this.systemModuleService.off();
            this.systemModuleService.announceSweetProxy('Principal Id entered doens\'t belong to a Principal of a family', 'error');
        } else {
            this.familyCoverService.find({ query: { 'facilityId': this.facility._id } }).then(payload => {
                if (payload.data.length > 0) {
                    const facFamilyCover = payload.data[0];
                    this.selectedFamilyCover = facFamilyCover;
                    this.beneficiaries = facFamilyCover.familyCovers;
                    const info = this.beneficiaries.filter(x => x.filNo === this.faId);
                    this.family = info[0];
                    if (info.length === 0) {
                        this.systemModuleService.off();
                        this.systemModuleService.announceSweetProxy('Principal Id doesn\'t exist', 'error');
                    } else {
                        if (this.shouldMoveFirst === true) {
                            this.saveFamilyPerson();
                        } else {
                            this.frmNewEmp4_show = false;
                            this.frmNewPerson1_show = true;
                            this.frmNewPerson2_show = false;
                            this.frmNewPerson3_show = false;
                            this.paymentPlan = false;
                            this.loading = false;
                        }
                    }
                }
            });
        }
    }

    getRole(beneficiary) {
        const filNo = beneficiary;
        console.log(filNo);
        if (filNo !== undefined) {
            const filNoLength = filNo.length;
            const lastCharacter = filNo[filNoLength - 1];
            console.log(filNoLength, lastCharacter);
            return isNaN(lastCharacter) ? 'D' : 'P';
        }
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

        });
    }
    getMaritalStatus() {
        this.maritalStatusService.findAll().then(payload => {
            this.maritalStatuses = payload.data;
        }).catch(err => {

        });
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
                return Observable.fromPromise(this.patientService
                    .find({ query: { personId: this.selectedPerson._id, facilityId: this.facility._id } }));
            } else {
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
                return Observable.of(undefined);
            }
        }).subscribe((result: any) => {
            if (result === undefined) {
                this.selectedPerson = undefined;
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
            } else if (result.data.length > 0) {
                this.selectedPerson = undefined;
                this.errMsg = 'This APMIS ID is valid or has been previously used to generate a patient!';
                this.mainErr = false;
            } else {
                this.frmNewEmp4_show = false;
                this.apmisId_show = false;
                this.mainErr = true;
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.paymentPlan = false;
                this.shouldMoveFirst = true;
                this.paymentPlan = true;
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
        const patient: any = {
            personId: this.selectedPerson._id,
            facilityId: this.facility._id,
            paymentPlan: [
                {
                    planType: 'wallet',
                    isDefault: true
                }
            ]
        }
        this.patientService.create(patient).then(payl => {
            const billing: any = {
                discount: 0,
                facilityId: this.facility._id,
                grandTotal: this.planPrice,
                patientId: payl._id,
                subTotal: this.planPrice,
                billItems: [
                    {
                        unitPrice: this.planPrice,
                        facilityId: this.facility._id,
                        description: '',
                        facilityServiceId: this.facilityServiceId,
                        serviceId: this.planId,
                        patientId: payl._id,
                        quantity: 1,
                        totalPrice: this.planPrice,
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
                this.systemModuleService.off();
                const text =  this.selectedPerson.lastName + ' ' + this.selectedPerson.firstName
                + ' added successfully but bill not generated because price not yet set for this service';
                this.systemModuleService.changeMessage(payl);
                this.systemModuleService.announceSweetProxy(text, 'success');
                this.close_onClick();
            }).catch(errr => {
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
                this.loading = false;
                console.log(errr);
            });

        }).catch(err => {
            this.systemModuleService.off();
            this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
            this.loading = false;
        });

    }

    saveInsurancePerson() {
        const patient: any = {
            personId: this.selectedPerson._id,
            facilityId: this.facility._id,
            paymentPlan: [
                {
                    planType: 'wallet',
                    isDefault: false
                },
                {
                    planType: this.coverType,
                    isDefault: true,
                    planDetails: {
                        hmoId: this.hmo.hmoId,
                        principalId: this.hmoInsuranceId
                    }
                }
            ]
        }
        console.log(patient);
        this.patientService.create(patient).then(payl => {
            const billing: any = {
                discount: 0,
                facilityId: this.facility._id,
                grandTotal: this.planPrice,
                patientId: payl._id,
                subTotal: this.planPrice,
                billItems: [
                    {
                        unitPrice: this.planPrice,
                        facilityId: this.facility._id,
                        description: '',
                        facilityServiceId: this.facilityServiceId,
                        serviceId: this.planId,
                        patientId: payl._id,
                        quantity: 1,
                        totalPrice: this.planPrice,
                        unitDiscountedAmount: 0,
                        totalDiscoutedAmount: 0,
                        modifierId: [],
                        covered: {
                            name: this.hmo.hmoName,
                            _id: this.hmo.hmoId,
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
                this.systemModuleService.off();
                const text = this.selectedPerson.lastName + ' '
                + this.selectedPerson.firstName + ' added successfully but bill not generated because price not yet set for this service';
                this.systemModuleService.changeMessage(payl);
                this.systemModuleService.announceSweetProxy(text, 'success');
                this.close_onClick();
            }).catch(errr => {
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
                this.loading = false;
                console.log(errr);
            });

        }).catch(err => {
            this.systemModuleService.off();
            this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
            this.loading = false;
            console.log(err);
        });

    }


    saveCompanyPerson() {
        const facId = this.frmNewEmp1.controls['facId'].value;
        const facName = this.frmNewEmp1.controls['facName'].value;
        if (this.selectedPerson === undefined && this.selectedPerson._id === undefined) {
            const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.gender = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value.name,
                state: this.frmNewEmp2.controls['empContactState'].value.name

            }
            person._id = this.person_Id;
            person.lastName = this.frmNewEmp1.controls['empLastName'].value;
            person.maritalStatus = this.frmNewEmp2.controls['empMaritalStatus'].value;
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
                person.primaryContactPhoneNo = this.frmNewEmp1.controls['empPhonNo'].value;
                person.title = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
                person.wallet = {
                    balance: 0,
                    ledger: 0,
                    description: 'Initializing wallet'
                }


            } else {
                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.primaryContactPhoneNo = this.frmNewEmp1.controls['empPhonNo'].value;
                person.title = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            }



            this.personService.update(person).then(personPayload => {
                const patient: any = {
                    personId: personPayload._id,
                    facilityId: this.facility._id,
                    paymentPlan: [
                        {
                            planType: 'wallet',
                            isDefault: true,
                            planDetails: {
                                name: personPayload.firstName + ' ' + personPayload.lastName,
                                _id: personPayload._id
                            }
                        },
                        {
                            planType: 'company',
                            isDefault: false,
                            planDetails: {
                                
                            }
                        }
                    ]
                }
                this.patientService.create(patient).then(payl => {
                    this.servicePriceService
                    .find({ query: { facilityId: this.facility._id, serviceId: this.planId } }).then(payloadPrice => {

                        const servicePrice = payloadPrice.data[0];
                        const billing: any = {
                            discount: 0,
                            facilityId: this.facility._id,
                            grandTotal: this.planPrice,
                            patientId: payl._id,
                            subTotal: this.planPrice,
                            billItems: [
                                {
                                    unitPrice: this.planPrice,
                                    facilityId: this.facility._id,
                                    description: '',
                                    facilityServiceId: this.facilityServiceId,
                                    serviceId: this.planId,
                                    patientId: payl._id,
                                    quantity: 1,
                                    totalPrice: this.planPrice,
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
                            this.close_onClick();
                            this.systemModuleService.changeMessage(payl);
                            this.paymentPlan = false;
                            this.frmNewPerson1_show = false;
                            this.frmNewPerson2_show = false;
                            this.frmNewPerson3_show = false;
                            this.frmNewEmp4_show = false;
                            this.apmisId_show = false;
                            this.loading = false
                        }).catch(errr => {
                            this.loading = false;
                        });

                    }).catch(err => {
                        this.loading = false;
                    });

                });
            });
        } else {
            const patient: any = {
                personId: this.selectedPerson._id,
                facilityId: this.facility._id,
                paymentPlan: [
                    {
                        planType: 'wallet',
                        isDefault: true,
                        planDetails: {
                            name: this.selectedPerson.firstName + ' ' + this.selectedPerson.lastName,
                            _id: this.selectedPerson._id
                        }
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
            this.patientService.create(patient).then(payl => {
                this.servicePriceService.find({ query: { facilityId: this.facility._id, serviceId: this.planId } }).then(payloadPrice => {
                    const servicePrice = payloadPrice.data[0];
                    const billing: any = {
                        discount: 0,
                        facilityId: this.facility._id,
                        grandTotal: this.planPrice,
                        patientId: payl._id,
                        subTotal: this.planPrice,
                        billItems: [
                            {
                                unitPrice: this.planPrice,
                                facilityId: this.facility._id,
                                description: '',
                                facilityServiceId: this.facilityServiceId,
                                serviceId: this.planId,
                                patientId: payl._id,
                                quantity: 1,
                                totalPrice: this.planPrice,
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
                        this.close_onClick();
                        this.paymentPlan = false;
                        this.frmNewPerson1_show = false;
                        this.frmNewPerson2_show = false;
                        this.frmNewPerson3_show = false;
                        this.frmNewEmp4_show = false;
                        this.apmisId_show = false;
                        this.loading = false
                    }).catch(errr => {
                        this.loading = false;
                    });

                }).catch(err => {
                    this.loading = false;
                });

            });
        }

    }

    savePatientData(planType?) {

        const patient: any = {
            personId: this.selectedPerson._id,
            facilityId: this.facility._id,
            paymentPlan: [
                {
                    planType: 'wallet',
                    isDefault: true,
                    planDetails: {
                        name: this.selectedPerson.firstName + ' ' + this.selectedPerson.lastName,
                        _id: this.selectedPerson._id
                    }
                },
                {
                    planType: planType,
                    isDefault: false,
                    planDetails: this.planDetails
                }
            ]
        }
    }

    saveFamilyPerson() {
        const patient: any = {
            personId: this.selectedPerson._id,
            facilityId: this.facility._id,
            paymentPlan: [
                {
                    planType: 'wallet',
                    isDefault: false
                },
                {
                    planType: this.coverType,
                    planDetails: {
                        principalId: this.faId
                    },
                    isDefault: true
                }
            ]
        }
        this.patientService.create(patient).then(payl => {
            const billing: any = {
                discount: 0,
                facilityId: this.facility._id,
                grandTotal: this.planPrice,
                patientId: payl._id,
                subTotal: this.planPrice,
                billItems: [
                    {
                        unitPrice: this.planPrice,
                        facilityId: this.facility._id,
                        description: '',
                        facilityServiceId: this.facilityServiceId,
                        serviceId: this.planId,
                        patientId: payl._id,
                        quantity: 1,
                        totalPrice: this.planPrice,
                        unitDiscountedAmount: 0,
                        totalDiscoutedAmount: 0,
                        modifierId: [],
                        covered: {
                            name: this.family.othernames + ' ' + this.family.surname,
                            _id: this.family._id,
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
                this.systemModuleService.off();
                this.systemModuleService.changeMessage(payl);
                const text = this.selectedPerson.lastName + ' '
                + this.selectedPerson.firstName + ' added successfully but bill not generated because price not yet set for this service';
                this.systemModuleService.announceSweetProxy(text, 'success');
                this.close_onClick();
            }).catch(errr => {
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
                this.loading = false;
                console.log(errr);
            });

        }).catch(err => {
            this.systemModuleService.off();
            this.systemModuleService.announceSweetProxy('Some went wrong while creating a patient!', 'error');
            this.loading = false;
            console.log(err);
        });

    }

    findObjectByKey(array, key, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                array[i].i = i;
                return array[i];
            }
        }
        return null;
    }

    saveData() {
        console.log(this.coverType);
        if (this.coverType === 'insurance') {
            this.saveInsurancePerson();
        } else if (this.coverType === 'company') {
            this.saveCompanyPerson();
        } else if (this.coverType === 'wallet') {
            this.savePerson();
        } else if (this.coverType === 'family') {
            this.saveFamilyPerson();
        }
    }



    newPerson3(valid, val) {
        this.loading = true;
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
        this.loading = true;
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
    submit(frm, valid) {

        if (valid) {

            this.isSaving = true;
            this.systemModuleService.on();
            const personModel = <any>{
                title: this.titleCasePipe.transform(this.frmPerson.controls['persontitle'].value),
                firstName: this.titleCasePipe.transform(this.frmPerson.controls['firstname'].value),
                lastName: this.titleCasePipe.transform(this.frmPerson.controls['lastname'].value),
                gender: this.frmPerson.controls['gender'].value,
                dateOfBirth: this.frmPerson.controls['dob'].value,
                motherMaidenName: this.titleCasePipe.transform(this.frmPerson.controls['motherMaidenName'].value),
                // email: this.frmPerson.controls['email'].value,
                primaryContactPhoneNo: this.frmPerson.controls['phone'].value,
                // securityQuestion: this.frmPerson.controls['securityQuestion'].value,
                // securityAnswer: this.titleCasePipe.transform(this.frmPerson.controls['securityAnswer'].value)
            };
            const body = {
                person: personModel
            }
            const errMsg = 'There was an error while creating person, try again!';
            this.personService.createPerson(body).then((ppayload) => {
                this.isSaving = false;
                this.isSuccessful = true;
                this.systemModuleService.off();
                this.selectedPerson = ppayload;
                // this.isSuccessful = true;
                // let text = this.frmPerson.controls['firstname'].value + ' '
                //     + this.frmPerson.controls['lastname'].value + ' '
                //     + 'added successful';
                // this.frmPerson.reset();
                // this.isSaving = false;
                // this.systemModuleService.off();
                // this.systemModuleService.announceSweetProxy(text, 'success', this, HTML_SAVE_PATIENT);
                this.saveData();
                // this.frmNewPerson1_show = false;
                // this.frmNewPerson2_show = false;
                // this.frmNewPerson3_show = false;
                // this.frmNewEmp4_show = true;
                // this.apmisId_show = false;
            }, err => {
                this.isSaving = false;
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy(errMsg, 'error');
            }).catch(err => {
                this.isSaving = false;
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy(errMsg, 'error');
            });
        } else {
            this.isSaving = false;
            this.mainErr = false;
            this.errMsg = 'An error has occured, please check and try again!';
            this.systemModuleService.off();
        }













    }
    saveEmployee() {
        const model: Patient = <Patient>{};
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
            } else {}

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
