import { Component } from '@angular/core';
import { CompanyDto, SaveCompanyRequest, SaveCompanyResponse } from '../../services/models';
import { CompanyAdministrationService } from '../../services/services';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {
  company: CompanyDto = {
    address: { streetNumber: '', street: '', city: '', postalCode: '' }, // Replace with your `Address` structure
    createdDate: new Date().toISOString(),
    id: 0,
    name: '',
    users: [],
    webSocketTopicName: '',
  };
  isResponseSuccess: boolean | undefined = undefined;
  message: string = ''

  constructor(private companyAdministrationService: CompanyAdministrationService){

  }
  saveCompany(){
    const body: SaveCompanyRequest = {
      company: this.company
    }
    this.companyAdministrationService.saveCompany({body}).subscribe({
       next: (response) => {
        this.isResponseSuccess = true
        this.message = "Id nowo utworzonej firmy " + response.id || ''
       },
       error: (err) => {
        this.isResponseSuccess = false
        this.message = 'Błąd podczas dodawania firmy: ';
        if (err.error) {
          this.message =
            this.message + (err.error.errorCode || 'Nieznany bład');
        }
      }
    })
  }
}
