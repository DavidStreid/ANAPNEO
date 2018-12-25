import { Component, Input } from '@angular/core';
import EncodedFiles from '../../assets/encodedImgs/siteImgs';

@Component({
  selector: 'rewards-info',
  templateUrl: 'rewards-info.component.html',
  styleUrls: [ 'rewards-info.component.scss' ]
})

export class RewardsInfoComponent{
  @Input()
  userName: String = 'David Streid';

  @Input()
  points: number = 0;

  public userProfileImgSrc: String

  constructor(){
    const encodedFilesClass: EncodedFiles = new EncodedFiles();
    const encodedImgs: Object = encodedFilesClass.getImgs();
    this.userProfileImgSrc = encodedImgs['userProfile'];
  }
}
