import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';
import { RewardsComponent }             from '../../rewardsComponent/rewards.component';
import { MyHealthComponent }            from '../../myHealthComponent/myHealth.component';
import { AppointmentTrackerComponent }  from '../../appointmentTrackerComponent/appointment-tracker.component';
import { DocFinderComponent }           from '../../docFinderComponent/doc-finder.component';
import { LoginComponent }               from '../../loginComponent/login.component';

import { PageNotFoundComponent }        from '../../pageNotFoundComponent/pageNotFound.component';

export const appRoutes = [
  /*
    Remove routes if importing anapneo as a lazily-loaded module as they will be used for the parent's router-link, i.e.
    the parent view will only show these routed components rather than the view around the router-link
    Importing module should define these as childRoutes, e.g.

      import {
        AnapneoModule,
        AnapneoComponent,
        RewardsComponent,
        ... }    from 'anapneo-lib';

      ...

          export const AnapneoRoutes: Routes = [
            {
              path: '',
              component: AnapneoComponent,
              children: [
                {path: 'rewards',       component: RewardsComponent },
                ...
              ]
            }
          ];

      ...

      @NgModule({
        imports: [
          AnapneoModule,
          RouterModule.forChild(AnapneoRoutes),
          ...
        ],
      })
  */
  { path: 'rewards',      component: RewardsComponent },
  { path: 'appointments', component: AppointmentTrackerComponent },
  { path: 'health',       component: MyHealthComponent },
  { path: 'docs',          component: DocFinderComponent },
  { path: 'login',        component: LoginComponent },

  // WildCard route
  { path: '**',           component: LoginComponent },

  // No Path route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

// forChild used when imported lazily (only one forRoot allowed)
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AnapneoRoutingModule{}


