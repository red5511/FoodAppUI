import { Component, Input } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-new-user-panel',
  templateUrl: './new-user-panel.component.html',
  styleUrl: './new-user-panel.component.scss'
})
export class NewUserPanelComponent {
  @Input({required: true})
  hasCompaniesAccess!: boolean;
  @Input({required: true})
  hasPermissions!: boolean;
  messages: Message[] =  [
];

 ngOnInit(){
  if(this.hasCompaniesAccess){
    const companiesMessage: Message =  { severity: 'warning', summary: 'Nie masz dostępu do firmy, skontaktuj sie z naszą obsługą.' } 
    this.messages.push(companiesMessage)
  }
  if(this.hasPermissions){
    const permissionsMessage: Message =  { severity: 'warning', summary: 'Nie masz uprawnień do funkcjonalności, skontaktuj sie z naszą obsługą.' } 
    this.messages.push(permissionsMessage)
  }
 }

}
