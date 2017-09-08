import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { FormsManagerComponent } from './forms-manager.component';
import { formsManagerRoutes } from './forms-manager.routes';
import { FormsComponent } from './forms/forms.component';
import { SystemModulesResolverService } from '../../../resolvers/module-menu/index';
import { FormTypeResolverService, ScopeLevelResolverService } from '../../../resolvers/module-manager/index';
import { ScopeLevelService, FormTypeService } from '../../../services/module-manager/setup/index';
import { FormsService } from '../../../services/facility-manager/setup/index';
import { TreatementTemplateComponent } from './treatement-template/treatement-template.component';
import { TemplateMedicationComponent } from './treatement-template/template-medication/template-medication.component';
import { TemplateLabComponent } from './treatement-template/template-lab/template-lab.component';

@NgModule({
    declarations: [
        FormsManagerComponent,
        FormsComponent,
        TreatementTemplateComponent,
        TemplateMedicationComponent,
        TemplateLabComponent],
    exports: [
    ],
    imports: [
        SharedModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        formsManagerRoutes
    ],
    providers: [SystemModulesResolverService, ScopeLevelService, FormTypeService,
        ScopeLevelResolverService, FormTypeResolverService, FormsService]
})
export class FormsManagerModule { }



