import { NgModule } from '@angular/core';

import { PagerButtonComponent, AsomDataPagerComponent } from './ui-components/PagerComponent';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

@NgModule({
	imports: [ CommonModule, MatDialogModule ],
	exports: [ AsomDataPagerComponent ],
	declarations: [ AsomDataPagerComponent, PagerButtonComponent ],
	providers: [],
	entryComponents: []
})
export class CoreUiModules {}
