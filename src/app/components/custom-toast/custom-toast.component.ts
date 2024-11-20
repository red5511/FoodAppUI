import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.scss'],
  providers: [MessageService],
})
export class CustomToastComponent {
  constructor(private messageService: MessageService) {}

  showConfirm() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sticky',
      detail: 'Message Content',
      sticky: true,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
