import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { VendorLocatorComponent } from '../../vendorLocator/vendorLocator.component';
import { MyHealthComponent }      from '../../myHealthComponent/myHealth.component';
import { AppointmentsComponent }  from '../../appointmentsComponent/appointments.component';
import { PageNotFoundComponent } from '../../pageNotFoundComponent/pageNotFound.component';

export const appRoutes = [
  { path: 'rewards', component: VendorLocatorComponent },
  { path: 'appointments', component: MyHealthComponent },
  { path: 'feedback', component: AppointmentsComponent },
  { path: '', redirectTo: '/rewards', pathMatch: 'full' },
  // TODO - Create and add PageNotFoundComponent
  { path: '**', component: PageNotFoundComponent }
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


