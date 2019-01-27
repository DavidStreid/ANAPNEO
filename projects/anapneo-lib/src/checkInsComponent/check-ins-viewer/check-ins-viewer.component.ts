import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import EncodedFiles from '../../assets/encodedImgs/siteImgs';

@Component({
  selector: 'check-ins-viewer',
  templateUrl: './check-ins-viewer.component.html',
  styleUrls: ['./check-ins-viewer.component.scss']
})
export class CheckInsViewerComponent{
  @Input()
  public advocate: Object;

  public name: String;
  public type: String;
  public address: Object = {};
  public services: String[];
  public profileImg: String

  ngOnChanges(changes: SimpleChanges) {
    this.name     = this.advocate[ 'name' ]     || 'INVALID_NAME';
    this.type     = this.advocate[ 'type' ]     || 'INVALID_TYPE';
    this.address  = this.advocate[ 'address' ]  || {};
    this.services = this.advocate[ 'services' ] || '';
  }

  constructor(){
    const encodedFilesClass: EncodedFiles = new EncodedFiles();
    const encodedImgs: Object = encodedFilesClass.getImgs();
    this.profileImg = encodedImgs['userProfile'];
  }
}
