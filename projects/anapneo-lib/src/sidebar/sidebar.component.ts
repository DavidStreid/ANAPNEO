import { Component } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: [ 'sidebar.component.scss' ],
})
export class SideBarComponent {
  public descriptionTest: String = "Anapneo is an app-based rewards program to improve lung cancer prognosis.";

  constructor() {}
}
