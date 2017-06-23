import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CoolStorageModule } from 'angular2-cool-storage';

import {Routing} from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FacilitySetupModule } from './facility-setup/facility-setup.module';
import { LoginComponent } from './login/login.component';
import { SocketService, RestService } from './feathers/feathers.service';
import * as SetupService from './services/facility-manager/setup/index';
import * as ModuleManagerService from './services/module-manager/setup/index';
import { UserAccountsComponent } from './system-modules/user-accounts/user-accounts.component';
import { SharedModule } from './shared-module/shared.module';
// tslint:disable-next-line:max-line-length
import { UserAccountsInnerPopupComponent } from './system-modules/user-accounts/user-accounts-inner-popup/user-accounts-inner-popup.component';
import { CorporateSignupComponent } from './corporate-signup/corporate-signup.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupComponent } from './signup/signup.component';
import { ClinicHelperService } from '../app/system-modules/module-menu/clinic/services/clinic-helper.service';
import { SwitchUserResolverService } from '../app/resolvers/module-menu/index';
import { PersonAccountComponent } from './person-account/person-account.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { MainMenuComponent } from './main-menu/main-menu.component';

// tslint:disable-next-line:max-line-length
import {ApmisCheckboxChildComponent } from './system-modules/module-menu/patient-manager/patientmanager-detailpage/apmis-checkbox/apmis-checkbox-child.component';
import {ApmisCheckboxComponent } from './system-modules/module-menu/patient-manager/patientmanager-detailpage/apmis-checkbox/apmis-checkbox.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UserAccountsComponent,
    UserAccountsInnerPopupComponent,
    CorporateSignupComponent,
    PasswordResetComponent,
    SignupComponent,
    PersonAccountComponent,
    MainMenuComponent,
    // AppointmentComponent,
    ApmisCheckboxChildComponent,
    ApmisCheckboxComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    CoolStorageModule
  ],
  providers: [
    SocketService, RestService, SetupService.CountriesService, SetupService.FacilityTypesService,
    SetupService.FacilitiesService, SetupService.FacilityModuleService, SetupService.ConsultingRoomService,
    SetupService.FacilitiesService, SetupService.FacilityModuleService, SetupService.UserService, SetupService.GenderService,
    SetupService.TitleService, SetupService.ProfessionService, SetupService.PersonService,
    SetupService.CompanyHealthCoverService, SetupService.FamilyHealthCoverService, SetupService.AppointmentTypeService,
    SetupService.RelationshipService, SetupService.MaritalStatusService, SetupService.EmployeeService,
    ModuleManagerService.LocationService, ModuleManagerService.FacilityOwnershipService, SetupService.AppointmentService,
    SetupService.InvoiceService, SetupService.BillingService, SetupService.SchedulerService, SetupService.SchedulerTypeService,
    SetupService.PatientService, SetupService.CorporateFacilityService, SetupService.ImageUploadService,
    SetupService.TagDictionaryService, SetupService.ServiceDictionaryService, SetupService.CompanyCoverCategoryService,
    ModuleManagerService.FeatureModuleService, SetupService.AccessControlService, SetupService.ServicePriceService,
    SetupService.CanActivateViaAuthGuardService, SetupService.FacilitiesServiceCategoryService, SetupService.TagService,
    SetupService.InPatientListService, SetupService.RoomGroupService, SetupService.WardAdmissionService,
    SetupService.WorkSpaceService, SetupService.InPatientService, SetupService.WardDischargeTypesService, SetupService.DocumentationService,
    SetupService.InPatientTransferStatusService, ClinicHelperService, SwitchUserResolverService, SetupService.DictionariesService,
    SetupService.VitaLocationService, SetupService.VitalPositionService, SetupService.VitalRythmService, SetupService.PrescriptionService,
    SetupService.PrescriptionPriorityService, SetupService.RouteService, SetupService.FrequencyService, SetupService.DrugListApiService,
    SetupService.DrugDetailsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
