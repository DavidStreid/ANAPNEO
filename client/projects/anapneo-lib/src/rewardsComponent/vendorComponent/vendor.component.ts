import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable }       from 'rxjs/Observable';

@Component({
  selector: 'vendor',
  templateUrl: 'vendor.component.html',
  styleUrls: ['vendor.component.scss']
})

export class VendorComponent implements OnChanges {
  @Input()
  public name: String;

  @Input()
  public imgData: Object;

  private imgBase: String = "http://localhost:4300/img?name=";

  public imgSrc: String;
  public description: String = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  constructor(){}

  ngOnChanges(changes: SimpleChanges) {
    // Extract endcoded image data and assign to src
    const imgDataChanges  = changes['imgData'] || {};
    const imgData         = imgDataChanges[ 'currentValue' ] || {};
    const buffer          = imgData[ 'data' ] || [];

    const b64encoded = btoa(String.fromCharCode.apply(null, buffer));
    this.imgSrc = "data:image/png;base64," + b64encoded;
  }
}
