import { Component }        from '@angular/core';
import { MyHealthService }  from './myHealth.service';

@Component({
  selector: 'my-health',
  styleUrls: ['MyHealth.component.scss'],
  templateUrl: 'MyHealth.component.html'
})

export class MyHealthComponent{
  public healthProfile: Object = {};
  public checkIns: any = {};

  public prescriptions: Object[];
  public doctors: Object[];

  constructor(private myHealthService:MyHealthService) {
    this.init();
  }

  init() {
    this.myHealthService.getHealthProfile().subscribe({
      next:     (res) => {
                              this.healthProfile = res['healthProfile'] || {};
                              this.assignCheckInData( res['checkIns'] || [] );
                },
      error:    (err) => { console.error('GetVendors Error: ' + err); },
      complete: ()    => { }
    });
  }

  /*
   * Formats entry of checkIn data for GUI
   */
  formatCheckInEntryByType( type: String, data: Object ){
    switch(type) {
      case 'Blood Pressure':
        const systolic = data[ 'systolic' ];
        const diastolic = data['diastolic'];
        return `${systolic}/${diastolic}`;
        break;
      default:
        return 'INVALID';
    }
  }

  /**
  * Assigns checkIn member variable based on checkInData of service response
  */
  assignCheckInData(checkInData: Object) {
    Object.keys(checkInData).forEach( (type) => {
      let checkInsForType = checkInData[ type ] || [];

      checkInsForType.forEach( (checkIn) => {
        let checkInEntry = checkIn['data'] || {};
        let checkInDate = checkIn['date'] || {};
        checkIn.data = this.formatCheckInEntryByType( type, checkIn.data  );
        checkIn.date = `${checkInDate['month']}-${checkInDate['day']}-${checkInDate['year']}`;
      });
    });

    this.checkIns = checkInData;
  }
}
