import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Context, ContextService } from '../../services/context/context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  messages: Message[] = [];
  messagesAreRdy: boolean = false
  private destroy$ = new Subject<void>();

  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit(): void {
    this.contextService
      .getContextObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (context) => {
          this.processBasedOnPermittedStuff(context);
        },
        error: (error) => {
          console.error('Error fetching context:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  processBasedOnPermittedStuff(context: any) {
    console.log('Received context:', context);
    const tempArr: Message[] = [];
    if (!Array.isArray(context.companies) || context.companies.length === 0) {
      const msg: Message = {
        severity: 'warn',
        detail:
          'Twój użytkownik nie jest podpiety do żadnej restauracji, skontaktuj się z nami, aby je podpiąć',
      };
      tempArr.push(msg);
    }

    if (
      !Array.isArray(context.permittedModules) ||
      context.permittedModules.length === 0
    ) {
      const msg: Message = {
        severity: 'warn',
        detail:
          'Twój użytkownik nie ma uprawnień do żadnego z modułów, skontaktuj się z nami, aby je dodać',
      };
      tempArr.push(msg);
    }

    this.messages = tempArr;
    console.log(this.messages)
    if (this.messages.length === 0) {
      this.processRedirections(context)
    }
    this.messagesAreRdy = true
  }

  processRedirections(context: Context){
    if(Array.isArray(context.permittedModules) && context.permittedModules.length > 0)
    {
      const includesLivePanel = context.permittedModules.includes('ONLINE_ORDERS')
      const includesRestaurantOrdering = context.permittedModules.includes('STATISTICS')
      if(includesLivePanel && !includesRestaurantOrdering){
        this.router.navigate(['/dashboard2']);
      }
      else if (!includesLivePanel && includesRestaurantOrdering){
        this.router.navigate(['/xd']); 
      }
    }

  }

  onClickedLivePanel(){
    this.router.navigate(['/dashboard2']); 
  }

  onClickedRestaurantOrder(){
    this.router.navigate(['/restaurant-order']); 
  }
}
