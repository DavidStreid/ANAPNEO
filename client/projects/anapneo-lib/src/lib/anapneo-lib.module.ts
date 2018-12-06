import { NgModule } from '@angular/core';
import { AnapneoLibComponent } from './anapneo-lib.component';
import { AnapneoModule } from '../anapneo/anapneo.module';

@NgModule({
  imports: [
    AnapneoModule
  ],
  declarations: [AnapneoLibComponent],
  exports: [AnapneoLibComponent, AnapneoModule]
})
export class AnapneoLibModule { }
