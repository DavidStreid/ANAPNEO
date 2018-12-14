import { Component } from '@angular/core';
import EncodedFiles from '../assets/encodedImgs/siteImgs';

@Component({
  selector: 'header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class HeaderComponent {
  public title: String = "ANAPNEO";
  public anapneoImgSrc: String = EncodedFiles.anapneoLogo;
}
