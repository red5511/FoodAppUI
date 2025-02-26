import { Component } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { DeliveryOptionService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DeliveryOptionDto } from '../../services/models';

@Component({
  selector: 'app-menu-delivery-option',
  templateUrl: './menu-delivery-option.component.html',
  styleUrl: './menu-delivery-option.component.scss',
})
export class MenuDeliveryOptionComponent {
  deliveryOptions: DeliveryOptionDto[] = [];
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
            console.log('xddddddddddddddddd');
            
            this.deliveryOptions = response.deliveryOptions;
          }
        },
      });
  }
}
