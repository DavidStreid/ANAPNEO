export class Appointment {
  public checkInData: Object[];
  public checkedIn: boolean;
  contact: string;
  date: Object;
  type: string;

  constructor(){
    // Initialized in an entry state
    this.checkInData = [];
    this.checkedIn = false;
    this.contact = "";       // Needs to be updated by the AppointmentDetails component
    this.date = {};          // Needs to be updated by the AppointmentDetails component
    this.type = "";          // Needs to be updated by the AppointmentDetails component
  }
}
