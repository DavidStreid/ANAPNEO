import { Component, OnInit } from '@angular/core';
import { CheckInsService } from './checkIns.service';

@Component({
  selector: 'check-ins',
  templateUrl: 'checkIns.component.html',
  styleUrls: [ 'checkIns.component.scss' ]
})

export class CheckInsComponent {
  public checkIns: Object[];

  constructor(private checkInsService: CheckInsService) {}

  ngOnInit() {
    this.getCheckIns();
  }

  // TODO - cache response
  private getCheckIns() {
    this.checkInsService.getCheckIns().subscribe({
      next:     (res)     => { this.checkIns = res['checkIns'] || [];       },
      error:    (err)     => { console.error('GetCheckIns Error: ' + err);  },
      complete: ()        => { }
    });
  }

  /*
   * Used by template to extract service data
   */
  public parseServices(advocate: Object) {
    if(! advocate){
      console.log('ERROR: Null advocate field in template parsing');
      return {};
    }
    const services = advocate[ 'services' ] || {};
    return services;
  }
}
