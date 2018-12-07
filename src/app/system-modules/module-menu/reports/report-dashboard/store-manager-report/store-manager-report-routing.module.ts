import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreManagerReportComponent } from './store-manager-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { StoreSalesReportComponent } from './store-sales-report/store-sales-report.component';

const STORE_MANAGER_REPORT_ROUTE: Routes = [

  {
    path: '',
    component: StoreManagerReportComponent,
    children: [
      { path: '', redirectTo: 'salesReport' },

      {
        path: 'salesReport',
        loadChildren: './store-manager-report/store-manager-report.module#StoreManagerReportModule'
      }
    ]
  }
];

// {
//   path: '',
//   component: ReportsComponent,
//   children: [
//     { path: '', redirectTo: 'report-dashboard' },
//     {
//       path: 'report-dashboard',
//       loadChildren: './report-dashboard/report-dashboard.module#ReportDashboardModule'
//     }
//   ]
// }
// ];


export const StoreManagerReportRoutingModule = RouterModule.forChild(STORE_MANAGER_REPORT_ROUTE);
