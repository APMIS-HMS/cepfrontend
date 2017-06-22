import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { WalletHomeComponent } from './wallet-home/wallet-home.component';
import { WalletComponent } from './wallet.component';
import { walletRoutes } from './wallet.routes';



@NgModule({
    declarations: [
        WalletComponent,
        WalletHomeComponent],

    exports: [
    ],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        walletRoutes
    ],
    providers: []
})
export class WalletModule { }



