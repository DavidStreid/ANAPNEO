import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// ROOT Component
import { AppComponent } from './app.component';

// CHILD Components
import { VendorLocatorComponent } from '../VendorLocator/vendorLocator.component';
import { VendorComponent } from '../VendorLocator/VendorComponent/vendor.component';
import { HeaderComponent } from '../header/header.component';

// Services
import { LocationService } from '../services/location.service';
import { UserProfileService } from '../userProfile/userProfile.service';

const SERVICES = [ LocationService, UserProfileService ];
const COMPONENTS = [ VendorLocatorComponent, VendorComponent, HeaderComponent ];

@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ SERVICES ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
