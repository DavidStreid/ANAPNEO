import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Loads dynamically
// import { AnapneoModule } from '../../projects/anapneo-lib/src/anapneo/anapneo.module';

// Loads from library
import { ɵa as AnapneoModule } from 'anapneo-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AnapneoModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
