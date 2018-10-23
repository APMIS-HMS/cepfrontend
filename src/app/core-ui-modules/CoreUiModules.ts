import {NgModule} from '@angular/core';

import {PagerButtonComponent, AsomDataPagerComponent} from './ui-components/PagerComponent';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [CommonModule],
    exports: [AsomDataPagerComponent],
    declarations: [AsomDataPagerComponent, PagerButtonComponent],
    providers: [],
})
export class CoreUiModules {
}


