import { Component } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { DeliveryOptionService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DeliveryOptionDto, ModifyDeliveryOptionRequest } from '../../services/models';
import { DeleteDeliveryOption$Params } from '../../services/fn/delivery-option/delete-delivery-option';
import { ModifyDeliveryOption$Params } from '../../services/fn/delivery-option/modify-delivery-option';

@Component({
  selector: 'app-menu-delivery-option',
  templateUrl: './menu-delivery-option.component.html',
  styleUrl: './menu-delivery-option.component.scss',
})
export class MenuDeliveryOptionComponent {
  deliveryOptions: DeliveryOptionDto[] = [];
  clonedDeliveryOptions: { [s: number]: DeliveryOptionDto } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private contextService: ContextService,
    private deliveryOptionService: DeliveryOptionService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.contextService
      .getCompanyIdObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadDeliveryOptions();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDeliveryOptions() {
    this.deliveryOptionService
      .getAllDeliveryOptions({
        companyId: this.contextService.getCompanyId() ?? -999,
      })
      .subscribe({
        next: (response) => {
          if (response.deliveryOptions) {
            this.deliveryOptions = response.deliveryOptions;
          }
        },
      });
  }

  onDelteDeliveryOption(deliveryOption: DeliveryOptionDto){
    const params: DeleteDeliveryOption$Params = {
      deliveryOptionId: deliveryOption.id!,
      companyId: this.contextService.getCompanyId() ?? -999,
    }
    this.deliveryOptionService.deleteDeliveryOption(params).subscribe({
      next: () => {
        this.deliveryOptions = this.deliveryOptions.filter(option => option.id !== deliveryOption.id);
        this.toastService.success('Usunięci przebiegło poprawnie')
      }
    });
  }

  onRowEditInit(deliveryOption: DeliveryOptionDto) {
    this.clonedDeliveryOptions[deliveryOption.id!] = { ...deliveryOption };
    
}

  onRowEditSave(deliveryOption: DeliveryOptionDto) {
    if (deliveryOption.deliveryPrice! > 0 && deliveryOption.distance! >= 0) {
        delete this.clonedDeliveryOptions[deliveryOption.id!];

        const params: ModifyDeliveryOption$Params = {
          body: {
            deliveryOption: deliveryOption
          },
          companyId: this.contextService.getCompanyId() ?? -999
        }
        this.deliveryOptionService.modifyDeliveryOption(params).subscribe({
          next: () => {
            this.toastService.success("Modyfikacja przebiegła poprawnie")
          }
        })
    }
}

onRowEditCancel(deliveryOption: DeliveryOptionDto, index: number) {
    this.deliveryOptions[index] = this.clonedDeliveryOptions[deliveryOption.id!];
    delete this.clonedDeliveryOptions[deliveryOption.id!];
}
}
