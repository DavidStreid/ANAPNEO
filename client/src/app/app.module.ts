import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Loads dynamically
import { AnapneoModule } from '../../projects/anapneo-lib/src/anapneo/anapneo.module';

// Loads from library
// import { ɵa } from 'anapneo-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AnapneoModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
