import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';
import { VendorLocatorComponent }       from '../../vendorLocator/vendorLocator.component';
import { MyHealthComponent }            from '../../myHealthComponent/myHealth.component';
import { AppointmentTrackerComponent }  from '../../appointmentTrackerComponent/appointment-tracker.component';
import { PageNotFoundComponent }        from '../../pageNotFoundComponent/pageNotFound.component';

export const appRoutes = [
  { path: 'rewards',      component: VendorLocatorComponent },
  { path: 'appointments', component: AppointmentTrackerComponent },
  { path: 'health',     component: MyHealthComponent },

  // WildCard route
  { path: '**',           component: PageNotFoundComponent },

  // No Path route
  { path: '', redirectTo: '/rewards', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule{}


