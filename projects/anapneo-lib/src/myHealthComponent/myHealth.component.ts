import { Component }        from '@angular/core';
import { MyHealthService }  from './myHealth.service';

@Component({
  selector: 'my-health',
  styleUrls: ['MyHealth.component.scss'],
  templateUrl: 'MyHealth.component.html'
})

export class MyHealthComponent {
  public healthProfile: Object = {};
  public checkIns: any = {};

  public prescriptions: Object[];
  public doctors: Object[];

  constructor(private myHealthService: MyHealthService) {
    this.init();
  }

  init() {
    this.getHealthProfile();
  }

  getHealthProfile(){
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
  formatCheckInEntryByType( type: String, data: Object ) {
    switch (type) {
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
  * Formats service response into a map of checkIns
  *
  * @checkInList - [ {
  *                     checkInData: [ { data: {}, type: '' } ],
  *                     checkedIn: boolean, date: {}
  *                   }, ... ]
  * @return - { checkInType: [ { date: '', data: '' } ] }
  */
  assignCheckInData(checkInList: Object[]) {
    const checkInMap: Object = {};

    checkInList.forEach( (checkIn) => {
      // Only take data from checkins that have been registered
      const checkedIn   = checkIn[ 'checkedIn' ] || false;
      if ( checkedIn ) {
        const checkInData = checkIn[ 'checkInData' ] || [];
        checkInData.forEach( (entry) => {
          const type = entry[ 'type' ] || 'INVALID_KEY';

          const data          = this.formatCheckInEntryByType( type, entry[ 'data' ] );
          const checkInDate = checkIn[ 'date' ] || {};
          const date        = `${checkInDate['month']}-${checkInDate['day']}-${checkInDate['year']}`;

          const formattedCheckIn = { date, data };
          if ( type in checkInMap ) {
            checkInMap[ type ].push( formattedCheckIn );
          } else {
            checkInMap[ type ] = [ formattedCheckIn ];
          }
        });
      }
    });

    this.checkIns = checkInMap;
  }
}
