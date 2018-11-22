import { Component } from '@angular/core';

@Component({
  selector:     'vendor-locator',
  templateUrl:  './vendorLocator.component.html',
  styleUrls:    ['./vendorLocator.component.scss']
})
export class VendorLocatorComponent {
  private vendors: Object[];
  vendorSections: Object[];

  constructor(){
    this.vendors = this.getVendors();
  }

  getVendors(): Object[] {
    return [
      this.createVendor('CVS', 'png'),
      this.createVendor('Walgreens', 'jpg'),
      this.createVendor('Amazon', 'jpg'),
      this.createVendor('NYSC', 'png'),
      this.createVendor('CVS', 'png'),
      this.createVendor('Walgreens', 'jpg'),
      this.createVendor('Amazon', 'jpg'),
      this.createVendor('NYSC', 'png'),
    ];

  }

  createVendor( name: String, ext: String ): Object {
    let path = '../assets/img/';
    const img = path + name + '.' + ext;
    const mentor = { name, img };
    return mentor;
  }

}
