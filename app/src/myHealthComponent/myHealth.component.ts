import { Component } from '@angular/core';

@Component({
  selector: 'my-health',
  styleUrls: ['MyHealth.component.scss'],
  templateUrl: 'MyHealth.component.html'
})

export class MyHealthComponent{
  public prescriptions: Object[];
  public doctors: Object[];

  constructor() {
    this.init();
  }

  init() {
    this.prescriptions = this.getPrescriptions();
    this.doctors = this.getDoctors();
  }

  getDoctors(): Object[] {
    // TODO - Replace w/ service call
    const doctors = [
      {
        name: 'Eric Toig',
        type: 'Primary Care'
      },
      {
        name: 'House',
        type: 'Oncologist'
      }
    ];

    return doctors;
  }

  getPrescriptions(): Object[] {
    // TODO - implment service call
    const prescriptions = [
      {
        name: 'MultiVitamin',
        qty: 1,
        frequency: 'daily'
      },
      {
        name: 'NicodermCQ',
        qty: 1,
        frequency: 'daily'
      }
    ];

    return prescriptions;
  }
}
