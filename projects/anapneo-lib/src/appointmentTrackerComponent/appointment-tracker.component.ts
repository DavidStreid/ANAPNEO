import { Component } from '@angular/core';

@Component({
  selector: 'appointment-tracker',
  templateUrl: 'appointment-tracker.component.html',
  styleUrls: [ 'appointment-tracker.component.scss' ]
})

export class AppointmentTrackerComponent {
  public appointments: Object[];

  constructor(){
    this.init();
  }

  init() {
    this.appointments = this.getAppointments();
  }

  getAppointments(): Object[] {
    const appointments = [
      {
        title: 'CT Scan',
        place: 'Mt. Sinai Hospital',
        address: {
          street: '1468 Madison Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: 10029
        },
        date: {
          day: 22,
          month: 11,
          year: 2018
        }
      },
      {
        title: 'Physical',
        place: 'Mt. Sinai Hospital',
        address: {
          street: '1468 Madison Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: 10029
        },
        date: {
          day: 30,
          month: 11,
          year: 2018
        }
      }
    ];

    return appointments;
  }
}
