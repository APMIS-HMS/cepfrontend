import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import * as SetupService from './services/facility-manager/setup/index';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { UserAccountsComponent } from './system-modules/user-accounts/user-accounts.component';
import { SwitchUserResolverService } from './resolvers/module-menu/index';

const appRoutes: Routes = [
  {
    path: 'modules',
    loadChildren: './system-modules/system-module#SystemModule',
    canActivate: [
      SetupService.CanActivateViaAuthGuardService
    ]
  },
  {
    path: 'login', component: HomeComponent
  },
  {
    path: 'accounts', component: UserAccountsComponent, resolve: { switchUsers: SwitchUserResolverService }
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

// export default RouterModule.forRoot(appRoutes);
export const Routing = RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules });
