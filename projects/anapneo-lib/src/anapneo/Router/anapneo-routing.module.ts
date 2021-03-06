import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';
import { MyHealthComponent }            from '../../myHealthComponent/myHealth.component';
import { CheckInsComponent  }           from '../../checkInsComponent/checkIns.component';
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
        ... }    from 'anapneo-lib';

      ...

          export const AnapneoRoutes: Routes = [
            {
              path: '',
              component: AnapneoComponent,
              children: [
                {path: 'check-ins',    component: CheckInsComponent },
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
  { path: 'health',       component: MyHealthComponent },
  { path: 'check-ins',    component: CheckInsComponent },
  { path: 'login',        component: LoginComponent },

  // WildCard route
  { path: '**',           component: CheckInsComponent },

  // No Path route
  { path: '', redirectTo: '/check-ins', pathMatch: 'full' },
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

export class AnapneoRoutingModule {}


