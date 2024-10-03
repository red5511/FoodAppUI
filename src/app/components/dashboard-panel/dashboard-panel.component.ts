import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputSwitchChangeEvent, InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrl: './dashboard-panel.component.scss',
})
export class DashboardPanelComponent {
  @Input({ required: true }) companyName!: string;
  @Input({ required: true }) checkedCompany!: boolean;
  @Input({ required: true }) checkedUser!: boolean;
  @Output() onToogleCheckbox: EventEmitter<boolean> = new EventEmitter();

  onChange(event: InputSwitchChangeEvent) {
    this.checkedUser = event.checked
    this.onToogleCheckbox.emit(this.checkedUser)
  }
}
