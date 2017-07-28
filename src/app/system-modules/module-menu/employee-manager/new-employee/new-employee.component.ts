import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import {
    ProfessionService, RelationshipService, MaritalStatusService, GenderService, TitleService, CountriesService, EmployeeService,
    PersonService,UserService
} from '../../../../services/facility-manager/setup/index';

import {
    Facility, Address, Profession, Relationship, Employee, Person, Department, MinorLocation, Gender, Title, Country,User, Role
} from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-new-employee',
    templateUrl: './new-employee.component.html',
    styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {

    mainErr = true;
    skipNok = false;
    errMsg = 'you have unresolved errors';

    selectedPerson: Person = <Person>{};
    user: User = <User>{};
    apmisId_show = true;
    frmNewPerson1_show = false;
    frmNewPerson2_show = false;
    frmNewPerson3_show = false;
    frmNewEmp4_show = false;

    newEmpIdControl = new FormControl();
    public frmNewEmp1: FormGroup;
    public frmNewEmp2: FormGroup;
    public frmNewEmp3: FormGroup;
    public frmNewEmp4: FormGroup;

    @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    public events: any[] = []; // use later to display form changes
    shouldMoveFirst = false;

    empImg: any;
    cropperSettings: CropperSettings;
    facility: Facility = <Facility>{};
    departments: Department[] = [];
    units: any[] = [];
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

    nextOfKinReadOnly = false;
    constructor(private formBuilder: FormBuilder,
        private titleService: TitleService,
        private countryService: CountriesService,
        private genderService: GenderService,
        private maritalStatusService: MaritalStatusService,
        private relationshipService: RelationshipService,
        private professionService: ProfessionService,
        private locker: CoolSessionStorage, private employeeService: EmployeeService,
        private personService: PersonService, private userService: UserService
    ) {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 400;
        this.cropperSettings.height = 400;
        this.cropperSettings.croppedWidth = 400;
        this.cropperSettings.croppedHeight = 400;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;

        this.empImg = {};
    }

    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            console.log(that.cropper);
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }
    updatePerson(person: Person) {
        // this.personService.update(person).then(rpayload => {
        //     this.selectedEmployee.employeeDetails = rpayload;
        //     this.close_onClick();
        // });
    }
    previewFile() {
        // this.selectedPerson.profileImage = this.empImg.image;
        // this.updatePerson(this.selectedPerson);
    }

    ngOnInit() {
        this.facility =  <Facility> this.locker.getObject('selectedFacility');
        this.departments = this.facility.departments;
        this.minorLocations = this.facility.minorLocations;
        this.prime();
        this.newEmpIdControl.valueChanges.subscribe(value => {
            this.mainErr = true;
            this.errMsg = '';
        });

        this.frmNewEmp1 = this.formBuilder.group({

            empTitle: ['', [<any>Validators.required]],
            empFirstName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empOtherNames: ['', [<any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empLastName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empGender: ['', [<any>Validators.required]],
            fileNumber: ['', [<any>Validators.required]],
            empNationality: ['', [<any>Validators.required]],
            empState: ['', [<any>Validators.required]],
            empLga: ['', [<any>Validators.required]],
            // tslint:disable-next-line:quotemark
            empEmail: [, [<any>Validators.pattern("^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$")]],
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
            empDOB: [new Date(), [<any>Validators.required]]

        });
        this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
            this.contactStates = value.states;
        });
        this.frmNewEmp2.controls['empContactState'].valueChanges.subscribe((value) => {
            this.cities = value.cities;
        });
        this.frmNewEmp3 = this.formBuilder.group({

            nok_fullname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(40)]],
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
            empUnit: ['', []],
            empLoc: ['', [<any>Validators.required]],
            empWorkEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            empWorkPhonNo: ['', [<any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
            empJobTitle: ['', [<any>Validators.required]],
            empLevel: ['', [<any>Validators.required]]

        });
        this.frmNewEmp4.controls['empDept'].valueChanges.subscribe(value => {
            this.departments.forEach((item, i) => {
                if (value === item._id) {
                    this.units = item.units;
                }
            })
        });
        this.frmNewEmp4.controls['empJobTitle'].valueChanges.subscribe((value) => {
            this.cadres = value.caders;
        });
    }
    prime() {
        const profession$ = Observable.fromPromise(this.professionService.findAll());
        const relationship$ = Observable.fromPromise(this.relationshipService.findAll());
        const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
        const gender$ = Observable.fromPromise(this.genderService.findAll());
        const title$ = Observable.fromPromise(this.titleService.findAll());
        const country$ = Observable.fromPromise(this.countryService.findAll());
        Observable.forkJoin([profession$, relationship$, maritalStatus$, gender$, title$, country$]).subscribe((results: any) => {
            this.professions = results[0].data;
            this.relationships = results[1].data;
            this.maritalStatuses = results[2].data;
            this.genders = results[3].data;
            this.titles = results[4].data;
            this.countries = results[5].data;
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
        if (valid) {
            if (val.empTitle === '' || val.empTitle === ' ' || val.empFirstName === ''
                || val.empFirstName === ' ' || val.empLastName === '' || val.empLastName === ' '
                || val.empPhonNo === ' ' || val.empPhonNo === ''
                || val.empGender === '' || val.empNationality === '' || val.empLga === '' || val.empState === '') {
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
                this.mainErr = true;
                this.errMsg = '';
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = true;
                this.frmNewEmp4_show = false;
                this.apmisId_show = false;

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
            const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value.momentObj;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.genderId = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value,
                state: this.frmNewEmp2.controls['empContactState'].value

            };
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
                    });
            }

            person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
            person.phoneNumber = this.frmNewEmp1.controls['empPhonNo'].value;
            person.titleId = this.frmNewEmp1.controls['empTitle'].value;
            person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
            person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
            person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            // person.profileImage = this.empImg.image;

            this.personService.create(person).then(payload => {
                this.selectedPerson = payload;
                this.user.email = payload.email;
                this.user.personId = payload._id;
                this.user.facilitiesRole = [];
                this.user.facilitiesRole.push(<Role>{ facilityId: this.facility._id });
                this.userService.create(this.user).then((upayload) => {});
                if (this.skipNok) {
                    this.saveEmployee();
                }
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = true;
                this.apmisId_show = false;
                this.mainErr = true;
            });
        }
    }

    newPerson3(valid, val) {
        console.log(valid);
        console.log(val);
        console.log(this.frmNewEmp3);
        if (this.skipNok || valid) {
            if (this.skipNok) {

                this.savePerson();
            } else {
                if (valid) {
                    console.log(1);
                    if (val.nok_fullname === '' || val.nok_fullname === ' ' || val.nok_relationship === ''
                        || val.nok_relationship === ' ' || val.nok_phoneNo === ' ' || val.nok_phoneNo === ''
                        || val.nok_Address === ' ' || val.nok_Address === '') {
                        this.mainErr = false;
                        this.errMsg = 'you left out a required field';
                    } else {
                        console.log(2);
                        this.mainErr = false;
                        this.savePerson();
                    }
                } else {
                    this.mainErr = false;
                    this.errMsg = 'you left out a required field';
                }
            }
        } else {
            this.mainErr = false;
            this.errMsg = 'you left out a required field';
        }
    }
    skip_nok() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = true;
        this.apmisId_show = false;
        this.mainErr = true;
        this.skipNok = true;
    }
    back_newPerson3() {
        console.log(this.shouldMoveFirst);
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
        const model: Employee = <Employee>{};
        model.facilityId = this.facility._id;
        model.departmentId = this.frmNewEmp4.controls['empDept'].value;
        if (model.units === undefined) {
            model.units = [];
        }
        if (this.frmNewEmp4.controls['empUnit'].value !== undefined) {
            model.units.push(this.frmNewEmp4.controls['empUnit'].value);
        }
        model.minorLocationId = this.frmNewEmp4.controls['empLoc'].value;
        model.officialContactNumber = this.frmNewEmp4.controls['empWorkPhonNo'].value;
        model.officialEmailAddress = this.frmNewEmp4.controls['empWorkEmail'].value;
        model.personId = this.selectedPerson._id;
        model.professionId = this.frmNewEmp4.controls['empJobTitle'].value._id;
        model.cadre = this.frmNewEmp4.controls['empLevel'].value;

        console.log(model);
        this.employeeService.create(model).then(payload => {

        });
    }
    newEmp4(valid, val) {
        console.log(val);
        console.log(valid);
        if (valid) {
            if (val.empDept === '' || val.empLoc === '' || val.empJobTitle === '') {
                this.mainErr = false;
                this.errMsg = 'you left out a required field';
            } else {
                if (this.skipNok) {
                    this.savePerson();
                } else {
                    this.saveEmployee();

                }

                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = false;
                this.apmisId_show = false;
                this.mainErr = true;

                this.closeModal.emit(true);

            }
        } else {
            this.mainErr = false;
        }

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

    close_onClick() {
        this.closeModal.emit(true);
    }

}
