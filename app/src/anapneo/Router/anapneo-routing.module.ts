import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';
import { RewardsComponent }             from '../../rewardsComponent/rewards.component';
import { MyHealthComponent }            from '../../myHealthComponent/myHealth.component';
import { AppointmentTrackerComponent }  from '../../appointmentTrackerComponent/appointment-tracker.component';
import { DocFinderComponent }           from '../../docFinderComponent/doc-finder.component';
import { LoginComponent }               from '../../loginComponent/login.component';

import { PageNotFoundComponent }        from '../../pageNotFoundComponent/pageNotFound.component';

export const appRoutes = [
  { path: 'rewards',      component: RewardsComponent },
  { path: 'appointments', component: AppointmentTrackerComponent },
  { path: 'health',       component: MyHealthComponent },
  { path: 'doc',          component: DocFinderComponent },
  { path: 'login',        component: LoginComponent },

  // WildCard route
  { path: '**',           component: LoginComponent },

  // No Path route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AnapneoRoutingModule{}


