import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-delivey-time-dialog',
  templateUrl: './delivey-time-dialog.component.html',
  styleUrl: './delivey-time-dialog.component.scss',
})
export class DeliveyTimeDialogComponent {
  @Input({ required: true })
  setTimeDialogvisible!: boolean;
  @Input()
  deliveryDatePickedByUser: Date | undefined;
  @Input({ required: true })
  userDeliveryIsBiggerThat1Hour!: boolean;
  @Output()
  setTimeDialogvisibleChange = new EventEmitter<boolean>();
  @Output()
  selectedTimeChange = new EventEmitter<Date>();
  selectedTime: Date | undefined;
  messages: Message[] = [];

  predefinedTimes = [
    { label: '10 min', value: 10 },
    { label: '20 min', value: 20 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 h', value: 60 },
    { label: '1.5 h', value: 90 },
    { label: '2 h', value: 120 },
    { label: '2.5 h', value: 150 },
  ];

  ngOnInit(): void {
    if (this.deliveryDatePickedByUser !== undefined)
      this.messages = [
        {
          severity: 'warn',
          detail:
            'Obecnie wybrana godzina dostawy przez uzytkwonika to: ' +
            this.deliveryDatePickedByUser.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
        },
      ];
  }

  selectTime(value: number) {
    const now = new Date(); // Current date and time
    const updatedTime = new Date(now.getTime() + value * 60000); // Add minutes (60000 ms = 1 min)
    this.selectedTimeChange.emit(updatedTime); // Emit the updated Date object
    this.closeDialog();
  }

  approveSelectedCalendarTime() {
    if (this.selectedTime !== undefined) {
      this.selectedTimeChange.emit(this.selectedTime);
      this.closeDialog();
    }
  }

  closeDialog() {
    this.setTimeDialogvisible = false;
    this.setTimeDialogvisibleChange.emit(this.setTimeDialogvisible);
  }
}
