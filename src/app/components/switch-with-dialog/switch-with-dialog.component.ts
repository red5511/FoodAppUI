import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { WebSocketService } from '../../services/services';
import {
  CompanyDto,
  InitOrderWebSocketTopicRequest,
} from '../../services/models';
import { SocketService } from '../../services/websocket/socket-service';

@Component({
  selector: 'app-switch-with-dialog',
  templateUrl: './switch-with-dialog.component.html',
  styleUrl: './switch-with-dialog.component.scss',
})
export class SwitchWithDialogComponent {
  @Input({ required: true }) isChecked!: boolean;
  @Input({ required: true }) isHolding!: boolean;
  @Input({ required: true }) companies!: CompanyDto[];
  @Input({ required: true }) receivingCompanies!: CompanyDto[];
  @Output()
  onStartReceiving: EventEmitter<CompanyDto[]> = new EventEmitter<CompanyDto[]>();
  selectedCompanies: CompanyDto[] = [];
  isHoldingButtonDisabled: boolean = true;
  labelName: string = 'Odbieraj';
  showStopAllButton: boolean = false;

  dialogVisible = false; // Visibility of the confirmation dialog
  constructor(
    private contextService: ContextService,
    private webSocketService: WebSocketService,
    private socketService: SocketService
  ) {
    socketService.forcedConnectionChangeSubjectVisiblity$.subscribe((value) => {
      this.isChecked = value;
    });
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
      checked: '',
      unchecked: '',
    },
    switchColor: {
      checked: '',
      unchecked: '',
    },
    labels: {
      unchecked: 'Nie odbieram',
      checked: 'Odbieram',
    },
    fontColor: {
      checked: 'black',
      unchecked: 'black',
    },
    textAlign: 'center',
  };

  ngOnInit() {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor1 = rootStyles
      .getPropertyValue('--primary-color1')
      .trim();
    const primaryWhite = rootStyles.getPropertyValue('--primary-white').trim();
    const green = rootStyles.getPropertyValue('--primary-green').trim();
    this.config.color.unchecked = primaryWhite;
    this.config.color.checked = green;
    this.config.switchColor.unchecked = primaryColor1;
    this.config.switchColor.checked = primaryColor1;
    this.selectedCompanies = structuredClone(this.receivingCompanies);
  }

  ngOnChanges() {
    this.selectedCompanies = structuredClone(this.receivingCompanies);
    if (this.isChecked) {
      this.requestInitOrderWebSocketTopic();
    }
  }

  onCancel(): void {
    this.dialogVisible = false; // Close the dialog without toggling
  }

  onShowDialog() {
    this.isHoldingButtonDisabled = true;
  }

  onHideDialog(){
    this.selectedCompanies = structuredClone(this.receivingCompanies)
  }

  onConfirm(): void {
    this.dialogVisible = false; // Close the dialog
    if (!this.isChecked) {
      this.requestInitOrderWebSocketTopic();
    } else {
      localStorage.removeItem('dateTimeToTurnOnRecivingOrders');
      localStorage.removeItem('lastRecivingOrdersComanyId');
      this.isChecked = !this.isChecked;
      this.contextService.setUserReceivingOrdersActive(this.isChecked);
    }
  }

  onConfirmHolding() {
    this.requestInitOrderWebSocketTopicHolding();
    this.dialogVisible = false;
    setTimeout(() => {
      this.showStopAllButton = true;
    }, 300); // Delay in milliseconds
  }

  onStopAllHolding() {
    this.requestInitOrderWebSocketTopicStopAllHolding();
    this.dialogVisible = false;
    setTimeout(() => {
      this.showStopAllButton = true;
    }, 300); // Delay in milliseconds
  }

  onCheckboxChange() {
    this.labelName = this.receivingCompanies.length > 1 ? 'Zmień' : 'Odbieraj';
    if (
      !this.areArraysIdentical(this.receivingCompanies, this.selectedCompanies)
    ) {
      this.isHoldingButtonDisabled = false;
    } else {
      this.isHoldingButtonDisabled = true;
    }
  }

  areArraysIdentical(arr1: CompanyDto[], arr2: CompanyDto[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    const areIdentical = arr1.every((company1) =>
      arr2.some((company2) => company1.id === company2.id)
    );
    return areIdentical;
  }

  preventToggle(event: Event): void {
    // Prevent the toggle from toggling on click
    event.preventDefault();
    event.stopPropagation();
    this.dialogVisible = true; // Open the confirmation dialog
  }

  requestInitOrderWebSocketTopic() {
    const companyIdsToAdd = [this.contextService.getCompanyId() ?? -999];
    const body: InitOrderWebSocketTopicRequest = {
      companyIdsToAdd,
      companyIdsToRemove: [],
    };
    this.webSocketService.initOrderWebSocketTopic({ body }).subscribe({
      next: () => {
        this.isChecked = true;
        this.receivingCompanies.length = 0;
        this.receivingCompanies.push(this.contextService.getCompany()!);
        console.log(this.receivingCompanies);
        this.contextService.setReceivingCompaniesWithoutNext();
        this.contextService.setUserReceivingOrdersActive(this.isChecked);
        this.onStartReceiving.emit(this.receivingCompanies)
      },
    });
  }

  requestInitOrderWebSocketTopicHolding() {
    const receivingCompaniesIds = this.receivingCompanies.map(
      (company) => company.id
    );
    const selectedCompaniesIds = this.selectedCompanies.map(
      (company) => company.id
    );
    const companyIdsToAdd = selectedCompaniesIds.filter(
      (selectedId) => !receivingCompaniesIds.includes(selectedId)
    );
    const companyIdsToRemove = receivingCompaniesIds.filter(
      (receivingId) => !selectedCompaniesIds.includes(receivingId)
    );
    const body: InitOrderWebSocketTopicRequest = {
      companyIdsToAdd,
      companyIdsToRemove,
    };
    this.webSocketService.initOrderWebSocketTopic({ body }).subscribe({
      next: () => {
        this.isChecked = selectedCompaniesIds.length !== 0 ? true : false;
        this.receivingCompanies.length = 0;
        this.receivingCompanies.push(...this.selectedCompanies);
        this.contextService.setReceivingCompaniesWithoutNextHolding(
          selectedCompaniesIds
        );
        this.contextService.setUserReceivingOrdersActive(this.isChecked);
        this.onStartReceiving.emit()
      },
    });
  }

  requestInitOrderWebSocketTopicStopAllHolding() {
    const body: InitOrderWebSocketTopicRequest = {
      companyIdsToAdd: [],
      companyIdsToRemove: this.receivingCompanies.map((company) => company.id),
    };
    this.webSocketService.initOrderWebSocketTopic({ body }).subscribe({
      next: () => {
        this.isChecked = false;
        this.receivingCompanies.length = 0;
        this.contextService.setReceivingCompaniesWithoutNextHolding([]);
        this.contextService.setUserReceivingOrdersActive(this.isChecked);
      },
    });
  }
}
