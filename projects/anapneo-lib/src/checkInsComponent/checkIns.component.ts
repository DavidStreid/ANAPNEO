import { Component, OnInit }    from '@angular/core';
import { CheckInsService }      from './check-ins-service/checkIns.service';
import { Appointment }          from '../appointmentTrackerComponent/models/appointment';

@Component({
  selector: 'check-ins',
  templateUrl: 'checkIns.component.html',
  styleUrls: [ 'checkIns.component.scss' ]
})

export class CheckInsComponent implements OnInit {
  public checkIns: Object[];

  constructor(private checkInsService: CheckInsService) {}

  ngOnInit() {
    this.getCheckIns(false);
  }

  public getCheckIns(force: boolean) {
    this.checkInsService.getCheckIns(force).subscribe({
      next:     (res)     => { this.checkIns = this.parseCheckIns(res['checkIns'] || []);       },
      error:    (err)     => { console.error('GetCheckIns Error: ' + err);  },
      complete: ()        => { }
    });
  }

  /**
   * Orders checkIns from service call by date
   */
  private parseCheckIns(checkIns: Object[]) {
    function dateCompare(c1, c2) {
      const c1Date: Object = c1[ 'date' ];
      const c2Date: Object = c2[ 'date' ];

      if ( !c1Date ) {
        return 1;
      } else if ( !c2Date ) {
        return -1;
      }

      let diff = null;
      for ( const d of ['year', 'month', 'day'] ) {
        if ( c1Date[ d ] !== c2Date[ d ] ) {
          diff = d;
          break;
        }
      }
      if ( diff ) {
        if ( c1Date[ diff ] < c2Date[ diff ] ) {
          return -1;
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    }

    checkIns.forEach( (ci) => {
      ci['appointments'].sort(dateCompare);
    });

    return checkIns;
  }

  /*
   * Used by template to extract service data
   */
  public parseServices(advocate: Object) {
    if (! advocate) {
      console.log('ERROR: Null advocate field in template parsing');
      return {};
    }
    const services = advocate[ 'services' ] || {};
    return services;
  }

  /**
   * Creates an empty appointment object that will be added to that appointments entry of that user's advocate
   */
  addCheckIn(advocate: Object) {
    const appt = new Appointment();

    // TODO - better way to add a checkIn object
    for ( const ci of this.checkIns ) {
      if ( ci[ 'advocate' ] === advocate ) {
        ci[ 'appointments' ].push( appt );
        return;
      }
    }
    // TODO
    alert( 'BUG: Could not find the advocate to update' );
  }

  /**
   * Removes the appointment of index, aIdx, form the list of appointments for a checkIn
   *    cIdx: Index of checkIn
   *    aIdx: Index of appointment for checkIn
   */
  remove(cIdx, aIdx) {
    const targetCheckIn: Object = this.checkIns[cIdx] || {};
    const appointments: Object = targetCheckIn[ 'appointments' ];
    if ( appointments ) {
      targetCheckIn[ 'appointments' ].pop(aIdx);
    }
  }
}
