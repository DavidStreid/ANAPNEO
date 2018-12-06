import { Component, Input } from '@angular/core';


@Component({
  selector: 'rewards-info',
  templateUrl: 'rewards-info.component.html',
  styleUrls: [ 'rewards-info.component.scss' ]
})

export class RewardsInfoComponent{
  @Input()
  userName: String = 'David Streid';

  @Input()
  points: number = 0;
}
