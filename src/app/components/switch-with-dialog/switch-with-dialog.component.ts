import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { WebSocketService } from '../../services/services';
import { InitOrderWebSocketTopicRequest } from '../../services/models';
import { SocketService } from '../../services/websocket/socket-service';

@Component({
  selector: 'app-switch-with-dialog',
  templateUrl: './switch-with-dialog.component.html',
  styleUrl: './switch-with-dialog.component.scss',
})
export class SwitchWithDialogComponent {
  @Input() webSocketTopicName!: string;
  @Input() isDisabled = false;
  @Input({ required: true }) isChecked!: boolean;
  @Output() onToogleCheckbox: EventEmitter<boolean> = new EventEmitter();
  
  dialogVisible = false; // Visibility of the confirmation dialog
  constructor(
    private contextService: ContextService,
    private webSocketService: WebSocketService,
    private socketService: SocketService
  ) { 
    socketService.forcedConnectionChangeSubjectVisiblity$.subscribe((value) => {
        this.isChecked = value
    })
  }
  config = {
    name: '',
    disabled: false,
    height: 35,
    width: 160,
    margin: 3,
    fontSize: 16,
    speed: 300,
    color: {
      checked: '#4caf50',
      unchecked: '#fff',
    },
    switchColor: {
      checked: '#fff',
      unchecked: '#322653',
    },
    labels: {
      unchecked: 'Nie odbieram',
      checked: 'Odbieram',
    },
    fontColor: {
      checked: '#fff',
      unchecked: 'black',
    },
    textAlign: 'center',
  };

  onCancel(): void {
    this.dialogVisible = false; // Close the dialog without toggling
  }

  onConfirm(): void {
    this.dialogVisible = false; // Close the dialog
    if (!this.isChecked) {
      this.requestInitOrderWebSocketTopic();
    }
    else{
      this.isChecked = !this.isChecked;
      this.contextService.setUserReceivingOrdersActive(this.isChecked);
    }
  }
  preventToggle(event: Event): void {
    // Prevent the toggle from toggling on click
    event.preventDefault();
    event.stopPropagation();
    this.dialogVisible = true; // Open the confirmation dialog
  }

  requestInitOrderWebSocketTopic() {
    const body: InitOrderWebSocketTopicRequest = {
      companyId: this.contextService.getCompanyId() ?? -999,
      webSocketTopicName: this.webSocketTopicName,
    };
    this.webSocketService.initOrderWebSocketTopic({ body }).subscribe({
      next: () => {
        this.isChecked = !this.isChecked;
        this.contextService.setUserReceivingOrdersActive(this.isChecked);
      },
    });
  }
}
