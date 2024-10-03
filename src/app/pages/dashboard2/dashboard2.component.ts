import { booleanAttribute, Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { CustomToastComponent } from '../../components/custom-toast/custom-toast.component';
import { ContextService } from '../../services/context/context.service';


@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss'
})
export class Dashboard2Component {
  selectedOrder: any = null;
  orders = [
    { id: 1, amount: 100, date: '2024-09-01', description: 'Payment for Service A' },
    { id: 2, amount: 200, date: '2024-09-05', description: 'Payment for Service B' },
    { id: 3, amount: 150, date: '2024-09-10', description: 'Payment for Service C' }
  ];
  toastrMessage: ActiveToast<any> | undefined;
  isCompanyReceivingOrdersActive = false;
  isUserReceivingOrdersActive = false;
  companyName = '';

  constructor(private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private toastService: ToastrService,
    private contextService: ContextService) { }

  ngOnInit() {
    this.contextService.contextSubjectVisibility$.subscribe((context) => {
      this.isCompanyReceivingOrdersActive = context?.isCompanyReceivingOrdersActive ?? false;
      this.isUserReceivingOrdersActive = context?.isUserReceivingOrdersActive ?? false;
      this.companyName = context?.companyName ?? ''

    });
  }


  selectOrder(_t8: any) {
    throw new Error('Method not implemented.');
  }

  onToogleUserCheckbox(isChecked: boolean) {
    this.contextService.setUserReceivingOrdersActive(isChecked)
  }

}
