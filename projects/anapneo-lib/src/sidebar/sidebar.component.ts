import { Component } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: [ 'sidebar.component.scss' ],
})
export class SideBarComponent {
  public descriptionTest: String = 'HealthAdv connects community leaders to members who may benefit from a check-in';

  constructor() {}
}
