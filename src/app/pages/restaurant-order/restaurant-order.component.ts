import { Component } from '@angular/core';
import { OrderDto, ProductsByCategoryTabView } from '../../services/models';
import { ProductService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-restaurant-order',
  templateUrl: './restaurant-order.component.html',
  styleUrl: './restaurant-order.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        // When the element enters, start with opacity 0 and animate to 1.
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // When the element leaves, animate from full opacity to 0.
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class RestaurantOrderComponent {
  activeIndex: number = 0;
  productTabs: ProductsByCategoryTabView[] = [];
  modifiedOrder: OrderDto | undefined;
  destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private contextService: ContextService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['order']) {
        this.modifiedOrder = JSON.parse(params['order']);
        //todo walidacja ordera i redirect jak jest stary
        this.cartService.clearCart();
        this.modifiedOrder?.orderProducts?.forEach((el) => {
          el.id = Math.floor(Math.random() * 100000000000); // generuje fakowe id na potrzeby dzialania koszyka, backend je nadpisze
          this.cartService.addToCart(el, this.modifiedOrder?.id);
        });
        console.log('modifiedOrder');
        console.log(this.modifiedOrder);
      }
    });

    this.contextService
      .getCompanyIdObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getProductTabs();
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.modifiedOrder) {
      this.cartService.clearCart();
    }
  }

  getProductTabs() {
    this.productService
      .getProductsByCategories({
        companyId: this.contextService.getCompanyId() ?? -999,
      })
      .subscribe({
        next: (response) => {
          if (response.menuOrderingTabs) {
            this.productTabs = response.menuOrderingTabs;
          }
        },
      });
  }
}
