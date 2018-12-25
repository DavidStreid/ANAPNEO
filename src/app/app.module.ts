import { BrowserModule }                          from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Loads dynamically
import { AnapneoModule } from '../../projects/anapneo-lib/src/anapneo/anapneo.module';

@NgModule({
  imports: [
    AnapneoModule,
    BrowserModule
  ],
  declarations: [
    AppComponent
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
