import { Component, EventEmitter, Input, Output }       from '@angular/core';
import { FormGroup, FormControl }                       from '@angular/forms';

@Component({
  selector: 'entry-form',
  styleUrls: ['entry-form.component.scss'],
  templateUrl: 'entry-form.component.html'
})

export class EntryFormComponent {
  @Output()
  public update: EventEmitter<any> = new EventEmitter();
  @Output()
  public remove: EventEmitter<any> = new EventEmitter();

  public entryForm: FormGroup = new FormGroup({
    advocate: new FormControl(''),
    type: new FormControl('')
  });

  /**
   * Emits event w/ form data
   */
  public submitEntry() {
    const advocate: String = this.entryForm.value[ 'advocate' ] || '';
    const type: String = this.entryForm.value[ 'type' ] || '';

    if ( advocate !== '' && type !== '' ) {
      this.update.emit( { advocate, type } );
    } else {
      // TODO - modal to update user that they are missing an entry
    }
  }

  /**
   * Closes the entry and does not save it in the checkIn's appointment field. Emits action to remove it.
   */
  public closeEntry() {
    this.remove.emit();
  }
}
