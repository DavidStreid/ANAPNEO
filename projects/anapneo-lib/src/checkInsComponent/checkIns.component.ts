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

  private getCheckIns() {
    this.checkInsService.getCheckIns().subscribe({
      next:     (res)     => { this.checkIns = res['checkIns'] || [];       },
      error:    (err)     => { console.error('GetCheckIns Error: ' + err);  },
      complete: ()        => { }
    });
  }
}
