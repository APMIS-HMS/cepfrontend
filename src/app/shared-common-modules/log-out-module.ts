import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogoutConfirmComponent } from '../system-modules/module-menu/logout-confirm/logout-confirm.component';

@NgModule({
    declarations: [
        // DxDateBoxComponent,
        // UserAccountsHomeComponent,
        // UserAccountsComponent,
        // UserAccountsInnerPopupComponent,
        LogoutConfirmComponent
    ],
    exports: [
        LogoutConfirmComponent
    ],
    imports: [
        // LogoutConfirmComponent
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
    ],
    providers: [
    ]
})
export class LogOutConfirmModule { }



