import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ngbd-alert-selfclosing',
  styleUrls: ['./alert-selfclosing.scss'],
  templateUrl: './alert-selfclosing.html',
})
export class NgbdAlertSelfClosingComponent implements OnInit {
  @Input() lifetime = 5000;     // Time in ms the alert will remaining
  @Input() defaultMsg: string;
  @Input() subject: Subject<string>;    // publisher of messages
  @Input() leaveMsg: boolean;           // leave the initial message until user action
  @Input() type: string;                // custom or inbuilt type

  message: string;

  ngOnInit(): void {
    this.subject.subscribe((message) => this.message = message);
    this.subject.pipe(
      debounceTime(this.lifetime)
    ).subscribe(() => {
       if ( this.defaultMsg && this.leaveMsg) {
         this.leaveMsg = false;
       } else {
         this.message = null;
       } } );

    if (this.defaultMsg) {
      this.subject.next(this.defaultMsg);
    }
  }
}
