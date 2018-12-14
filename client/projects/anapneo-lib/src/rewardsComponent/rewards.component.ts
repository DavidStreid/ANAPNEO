import { Component }          from '@angular/core';
import { Observable }         from 'rxjs/Observable';
import { VendorInfoService }  from './vendorService/vendorInfoService';

@Component({
  selector:     'rewards',
  templateUrl:  './rewards.component.html',
  styleUrls:    ['./rewards.component.scss']
})
export class RewardsComponent {
  public vendors: Object[];
  vendorSections: Object[];

  constructor(private vendorInfoService: VendorInfoService){
    this.getVendors();
  }

  /*
   * Get vendors from service
   */
  getVendors(): void {
    this.vendorInfoService.getVendors('streid').subscribe({
      next:     (vendors) => { this.vendors = vendors['vendors'] || [];   },
      error:    (err)     => { console.error('Error: ' + err);            },
      complete: ()        => { }
    });
  }


}
