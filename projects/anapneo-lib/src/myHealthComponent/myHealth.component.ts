import { Component }        from '@angular/core';
import { MyHealthService }  from './myHealth.service';

@Component({
  selector: 'my-health',
  styleUrls: ['MyHealth.component.scss'],
  templateUrl: 'MyHealth.component.html'
})

export class MyHealthComponent{
  public healthProfile: Object = {};
  public prescriptions: Object[];
  public doctors: Object[];

  constructor(private myHealthService:MyHealthService) {
    this.init();
  }

  init() {
    this.myHealthService.getHealthProfile().subscribe({
      next:     (res) => {
                              this.healthProfile = res['healthProfile'] || {};
                              // this.checkIns = this.parseCheckInData( this.healthProfile['checkIns'] || {} );
      },
      error:    (err)           => { console.error('GetVendors Error: ' + err);            },
      complete: ()              => { }
    });
  }
}
