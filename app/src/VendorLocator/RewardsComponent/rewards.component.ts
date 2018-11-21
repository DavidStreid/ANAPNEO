import { Component, Input } from '@angular/core';


@Component({
  selector: 'rewards',
  templateUrl: 'rewards.component.html',
  styleUrls: [ 'rewards.component.scss' ]
})

export class RewardsComponent{
  @Input()
  userName: String = 'David Streid';

  @Input()
  points: number = 0;
}
