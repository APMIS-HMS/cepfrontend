import { DocumentationTemplateService } from './../../../services/facility-manager/setup/documentation-template.service';
import { SharedService } from 'app/shared-module/shared.service';
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
import { OrderSetTemplateService } from '../../../services/facility-manager/setup/index';
import { FormsService } from '../../../services/facility-manager/setup/index';
import { TreatementTemplateComponent } from './treatement-template/treatement-template.component';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SystemModuleService } from '../../../services/module-manager/setup/system-module.service';

@NgModule({
    declarations: [
        FormsManagerComponent,
        FormsComponent,
        TreatementTemplateComponent,
      ],
    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        formsManagerRoutes
    ],
    providers: [SystemModulesResolverService, ScopeLevelService, FormTypeService,
       OrderSetTemplateService,
        ScopeLevelResolverService, FormTypeResolverService, FormsService, SharedService, DocumentationTemplateService, SystemModuleService]
})
export class FormsManagerModule { }



