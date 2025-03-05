import { Component } from '@angular/core';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Context, ContextService } from '../../services/context/context.service';
import { Router } from '@angular/router';

interface MainCard {
  text: string,
  imgUrl: string,
  redirectUrl: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  messages: Message[] = [];
  cards: MainCard[] = []
  areCardsVisible: boolean = false
  private destroy$ = new Subject<void>();

  constructor(private contextService: ContextService, public router: Router) {
    this.cards = this.getCards()
  }

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
      // this.processRedirections(context)
      this.areCardsVisible = true
    }
  }

  // processRedirections(context: Context){
  //   if(Array.isArray(context.permittedModules) && context.permittedModules.length > 0)
  //   {
  //     const includesLivePanel = context.permittedModules.includes('ONLINE_ORDERS')
  //     const includesRestaurantOrdering = context.permittedModules.includes('STATISTICS')
  //     if(includesLivePanel && !includesRestaurantOrdering){
  //       this.router.navigate(['/dashboard2']);
  //     }
  //     else if (!includesLivePanel && includesRestaurantOrdering){
  //       this.router.navigate(['/xd']); 
  //     }
  //   }

  // }

  onClickedLivePanel(){
    this.router.navigate(['/active-orders']); 
  }

  onClickedRestaurantOrder(){
    this.router.navigate(['/restaurant-order']); 
  }

  getCards(): MainCard[]{
    var card1: MainCard = {
      text: 'Nowe zamówienie',
      imgUrl: 'images/NewOrder2.webp',
      redirectUrl: '/restaurant-order'
    }
    var card2: MainCard = {
      text: 'Na dowóz',
      imgUrl: 'images/DeliveryOrder.webp',
      redirectUrl: '/delivery-order'
    }
    
    var card3: MainCard = {
      text: 'Obsługa zamówień',
      imgUrl: 'images/HandleActiveOrder2.webp',
      redirectUrl: '/active-orders'
    }
    return [card1, card2, card3]
  }
}
