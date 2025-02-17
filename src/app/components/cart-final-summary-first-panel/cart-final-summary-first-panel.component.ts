import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderProductDto } from '../../services/models';
import { Subject } from 'rxjs/internal/Subject';
import { CartService } from '../../services/cart/cart-service';
import { takeUntil } from 'rxjs';
import { trigger, style, transition, animate } from '@angular/animations';
import { CartSummaryModel } from '../../common/commonModels';
import { ImageService } from '../../services/images/Image-service';
import { OrderUtils } from '../../common/orders-utils';

@Component({
  selector: 'app-cart-final-summary-first-panel',
  templateUrl: './cart-final-summary-first-panel.component.html',
  styleUrl: './cart-final-summary-first-panel.component.scss',
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(35px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-35px)' })
        ),
      ]),
    ]),
  ],
})
export class CartFinalSummaryFirstPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  @Output()
  onQuantityChangeNoneZero: EventEmitter<boolean> = new EventEmitter<boolean>();

  totalItems: number = 0;
  totalPrice: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    public imageService: ImageService,
    public orderUtils: OrderUtils,
  ) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartSummaryModel.orderProducts = cart.orderProducts;
        this.totalItems = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.quantity ?? 0),
          0
        );
        this.totalPrice = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.price ?? 0),
          0
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById(index: number, item: OrderProductDto): number | undefined {
    //potrzebne zeby animacja dzialal porawnie
    return item.id;
  }

  onQuantityChange(item: OrderProductDto) {
    this.orderUtils.onQuantityChange(item)
    if (item.id) {
      this.onQuantityChangeNoneZero.emit(true);
    }
  }

  updateOrderProductPrice(orderProduct: OrderProductDto): OrderProductDto {
    const basePrice = orderProduct.product?.price || 0;
    let extraPrice = 0;
    console.log('xd');
    console.log(orderProduct);

    if (orderProduct.productPropertiesList) {
      console.log('in orderProduct.productPropertiesList');

      for (const propGroup of orderProduct.productPropertiesList) {
        console.log('propGroup' + propGroup);
        console.log(propGroup);
        if (propGroup.propertyList) {
          for (const prop of propGroup.propertyList) {
            console.log('prop' + prop);
            console.log('price' + prop.price);
            extraPrice += prop.price || 0;
          }
        }
      }
    }
    const quantity = orderProduct.quantity || 1;
    const totalPrice = (basePrice + extraPrice) * quantity;
    console.log('updateOrderProductPrice');
    console.log(quantity);
    console.log(totalPrice);
    console.log(extraPrice);

    return { ...orderProduct, price: totalPrice };
  }
}
