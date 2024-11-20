import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
})
export class SwitchComponent {
  @Input() isDisabled = false;
  @Input({ required: true }) isChecked!: boolean;
  @Output() onToogleCheckbox: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onChange() {
    this.isChecked = !this.isChecked;
    this.onToogleCheckbox.emit(this.isChecked);
  }
}
