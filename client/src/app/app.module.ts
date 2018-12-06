import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { AnapneoModule } from '../../projects/anapneo-lib/src/anapneo/anapneo.module';
import { ɵa } from 'anapneo-lib';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ɵa
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
