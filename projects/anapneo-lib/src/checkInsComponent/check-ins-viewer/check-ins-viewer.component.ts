import { Component, Input } from '@angular/core';
import EncodedFiles from '../../assets/encodedImgs/siteImgs';

@Component({
  selector: 'check-ins-viewer',
  templateUrl: './check-ins-viewer.component.html',
  styleUrls: ['./check-ins-viewer.component.scss']
})
export class CheckInsViewerComponent{
  @Input()
  public name: String;
  @Input()
  public type: String;
  @Input()
  public address: Object = {};

  public profileImg: String

  constructor(){
    const encodedFilesClass: EncodedFiles = new EncodedFiles();
    const encodedImgs: Object = encodedFilesClass.getImgs();
    this.profileImg = encodedImgs['userProfile'];
  }
}
