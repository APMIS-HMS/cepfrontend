import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { Routing } from './dashboard-routes';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    exports: [
    ],
    imports: [
        Routing
    ],
    providers: [
    ]
})
export class DashboardModule { }



