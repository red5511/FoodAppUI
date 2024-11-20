import { booleanAttribute, Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { CustomToastComponent } from '../../components/custom-toast/custom-toast.component';
import { ContextService } from '../../services/context/context.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss',
})
export class Dashboard2Component {
  isCompanyReceivingOrdersActive = false;
  isUserReceivingOrdersActive = false;
  companyName = '';

  constructor(private contextService: ContextService) {}
  ngOnInit() {
    this.contextService.contextSubjectVisibility$.subscribe((context) => {
      this.companyName = context?.companyName ?? '';
    });
    this.contextService.userReceivingOrdersSubjectVisibility$.subscribe(
      (isReceiving) => {
        this.isUserReceivingOrdersActive = isReceiving;
      },
    );
  }

  onToogleUserCheckbox(isChecked: boolean) {
    this.contextService.setUserReceivingOrdersActive(isChecked);
  }
}
