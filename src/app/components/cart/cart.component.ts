import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { CartService } from '../../services/cart/cart-service';
import { CartModel } from '../../common/commonModels';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  @Input({ required: true })
  isBodyCartRightBar!: boolean;
  cartModel: CartModel = { orderProducts: [] };
  isSummaryPanelVisible: boolean = false;
  isOrderingPage: boolean = false;
  totalItems: number = 0;
  totalPrice: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartModel = cart;
        this.totalItems =
          this.cartModel?.orderProducts.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          ) ?? 0;
        this.totalPrice =
          this.cartModel?.orderProducts.reduce(
            (sum, item) => sum + (item.price || 0),
            0
          ) ?? 0;
      });

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isOrderingPage = this.router.url.includes('/restaurant-order');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSummaryClick() {
    this.isSummaryPanelVisible = true;
  }

  isFooterCartVisible() {
    return (
      this.isOrderingPage && this.totalItems > 0 && !this.isBodyCartRightBar
    );
  }
}
