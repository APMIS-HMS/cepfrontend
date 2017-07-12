import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import {
    ProfessionService, RelationshipService, MaritalStatusService, GenderService,
    TitleService, CountriesService, PatientService, PersonService, EmployeeService, FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import {
    Facility, Patient, Address, Profession, Relationship, Person,
    Department,
    MinorLocation, Gender, Title, Country
} from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
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

    shouldMoveFirst = false;
    nextOfKinReadOnly = false;

    newEmpIdControl = new FormControl('', Validators.required);
    public frmNewEmp1: FormGroup;
    public frmNewEmp2: FormGroup;
    public frmNewEmp3: FormGroup;
    public frmNewEmp4: FormGroup;

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

    // ***
    uploadFile: any;
    hasBaseDropZoneOver: boolean = false;
    options: NgUploaderOptions = {
        url: 'http://localhost:3030/image',
        autoUpload: false,
        data: { filename: '' }
    };
    sizeLimit = 2000000;

    // **
    OperationType: ImageUploaderEnum = ImageUploaderEnum.PersonProfileImage;
    constructor(private formBuilder: FormBuilder,
        private titleService: TitleService,
        private countryService: CountriesService,
        private genderService: GenderService,
        private maritalStatusService: MaritalStatusService,
        private relationshipService: RelationshipService,
        private professionService: ProfessionService,
        private locker: CoolSessionStorage, private patientService: PatientService,
        private personService: PersonService,
        private employeeService: EmployeeService,
        private facilityService: FacilitiesService
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
        let image: any = new Image();
        let file: File = $event.target.files[0];
        let myReader: FileReader = new FileReader();
        let that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            console.log(that.cropper);
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }
    uploadButton() {
        console.log('upload button clicked');
        if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
            if (this.selectedPerson.profileImageObject !== undefined) {
                console.log('aa');
                this.options.data.filename = this.selectedPerson.profileImageObject.filename;
            } else {
                console.log('bb');
                this.options.data.filename = 0;
            }
        }
        this.uploadEvents.emit('startUpload');
        console.log('event emitted');
    }
    beforeUpload(uploadingFile): void {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            alert('File is too large');
        }
    }
    handleUpload(data): void {
        console.log('am uploading 1')
        if (data && data.response) {
            console.log('am uploading 2')
            data = JSON.parse(data.response);
            let file = data[0].file;
            if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
                console.log('am uploading 3')
                this.personService.get(this.selectedPerson._id, {}).then(payload => {
                    if (payload != null) {
                        console.log('am uploading 4')
                        payload.profileImageObject = file;
                        this.updatePerson(payload);
                    }
                });
            } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
                console.log('am uploading 7')
                this.selectedPerson.profileImageObject = file;
                this.updatePerson(this.selectedPerson);
            }
        }
    }
    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
    updatePerson(person: Person) {
        console.log('am updating');
        this.personService.update(person).then(rpayload => {
            if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
                this.selectedPerson = rpayload;
            } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
                this.selectedPerson = rpayload;
            }
            this.close_onClick();
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

        this.frmNewEmp1 = this.formBuilder.group({

            empTitle: ['', [<any>Validators.required]],
            empFirstName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empOtherNames: ['', [<any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empLastName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empGender: ['', [<any>Validators.required]],

            empNationality: ['', [<any>Validators.required]],
            empState: ['', [<any>Validators.required]],
            empLga: ['', [<any>Validators.required]],
            empEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            empPhonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]

        });
        this.frmNewEmp1.controls['empNationality'].valueChanges.subscribe((value: Country) => {
            console.log(value);
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
            empDOB: [new Date(), [<any>Validators.required]]

        });
        this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
            console.log(value);
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
            console.log(payload.data);
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
    }

    getProfessions() {
        this.professionService.findAll().then(payload => {
            this.professions = payload.data;
        });
    }
    getRelationships() {
        this.relationshipService.findAll().then(payload => {
            this.relationships = payload.data;
        });
    }
    getMaritalStatus() {
        this.maritalStatusService.findAll().then(payload => {
            this.maritalStatuses = payload.data;
        });
    }
    getGenders() {
        this.genderService.findAll().then(payload => {
            this.genders = payload.data;
        });
    }
    getTitles() {
        this.titleService.findAll().then(payload => {
            this.titles = payload.data;
        });
    }
    getCountries() {
        this.countryService.findAll().then(payload => {
            this.countries = payload.data;
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
                this.errMsg = 'This APMIS ID is valid but has been previously used to generate an employee!';
                this.mainErr = false;
            } else {
                this.frmNewEmp4_show = true;
                this.apmisId_show = false;
                this.mainErr = true;
                this.frmNewEmp4_show = true;
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.apmisId_show = false;
                this.mainErr = true;
                this.shouldMoveFirst = true;
                console.log(this.shouldMoveFirst);
            }
        });


        // Observable.forkJoin([findPerson$, findPersonInFacilityEmployee$]).subscribe(results => {
        //     console.log(results);
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
        this.apmisId_show = true;
        this.mainErr = true;
    }

    newPerson1_show() {
        this.frmNewPerson1_show = true;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
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
        this.apmisId_show = false;
        this.mainErr = true;
    }

    newPerson2(valid, val) {
        console.log(this.empImg);
        if (valid) {
            if (val.empMaritalStatus === '' || val.empHomeAddress === ' ' || val.empHomeAddress === '' || val.empDOB === ' ') {
                this.mainErr = false;
                this.errMsg = 'you left out a required field';
            } else {

                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = true;
                this.frmNewEmp4_show = false;
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
        this.apmisId_show = false;
        this.mainErr = true;
    }

    savePerson() {
        {
            let person: Person = <Person>{ nextOfKin: [] };
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

                    });

                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;

                this.personService.create(person).then(payload => {
                    this.selectedPerson = payload;
                    // this.uploadButton();
                    this.frmNewPerson1_show = false;
                    this.frmNewPerson2_show = false;
                    this.frmNewPerson3_show = false;
                    this.frmNewEmp4_show = true;
                    this.apmisId_show = false;
                    this.mainErr = true;
                });
            } else {
                console.log('skip');
                person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
                person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
                person.titleId = this.frmNewEmp1.controls['empTitle'].value;
                person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
                person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
                person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;

                this.personService.create(person).then(payload => {
                    console.log('save person');
                    this.selectedPerson = payload;
                    this.uploadButton();
                    if (this.skipNok) {
                        this.saveEmployee();
                    }
                    this.frmNewPerson1_show = false;
                    this.frmNewPerson2_show = false;
                    this.frmNewPerson3_show = false;
                    this.frmNewEmp4_show = true;
                    this.apmisId_show = false;
                    this.mainErr = true;
                }, error => {
                    console.log(error);
                });
            }

        }
    }

    newPerson3(valid, val) {
        if (this.skipNok || valid) {
            console.log('skip');
            if (this.skipNok) {
                console.log('saving patient');
                this.savePerson();
            } else {
                if (valid) {
                    if (val.nok_fullname === '' || val.nok_fullname === ' ' || val.nok_relationship === ''
                        || val.nok_relationship === ' ' || val.nok_phoneNo === ' ' || val.nok_phoneNo === ''
                        || val.nok_Address === ' ' || val.nok_Address === '') {
                        this.mainErr = false;
                        this.errMsg = 'you left out a required field';
                    } else {
                        this.mainErr = true;
                        console.log('333');
                        this.savePerson();
                        // this.closeModal.emit(true);
                    }
                } else {
                    this.mainErr = false;
                }
            }
        }
    }

    skip_nok() {
        console.log('sking nok method');
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = true;
        this.apmisId_show = false;
        this.mainErr = true;
        this.skipNok = true;
        this.savePerson();
        this.closeModal.emit(true);
    }
    back_newPerson3() {
        if (this.shouldMoveFirst === true) {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.frmNewEmp4_show = false;
            this.apmisId_show = true;
            this.mainErr = true;
        } else {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = true;
            this.frmNewEmp4_show = false;
            this.apmisId_show = false;
            this.mainErr = true;
        }
    }
    saveEmployee() {
        let model: Patient = <Patient>{};
        model.facilityId = this.facility._id;
        model.personId = this.selectedPerson._id;
        console.log(model);
        this.patientService.create(model).then(payload => {
            this.close_onClick();
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
        // if (valid) {
        //     if (val.empDept === '' || val.empLoc === '' || val.empWorkEmail === '' || val.empWorkEmail === ' ') {
        //         this.mainErr = false;
        //         this.errMsg = 'you left out a required field';
        //     } else {
        //         if (this.skipNok) {
        //             this.savePerson();
        //         } else {
        //             this.saveEmployee();

        //         }

        //         this.frmNewPerson1_show = false;
        //         this.frmNewPerson2_show = false;
        //         this.frmNewPerson3_show = false;
        //         this.frmNewEmp4_show = false;
        //         this.apmisId_show = false;
        //         this.mainErr = true;

        //         this.closeModal.emit(true);

        //     }
        // } else {
        //     this.mainErr = false;
        // }

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
        });
    }

    close_onClick() {
        this.closeModal.emit(true);
        // this.facilityService.announceNotification({
        //     type: 'Info',
        //     text: 'This operation has been canceled!'
        // });
    }

}
