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
  @Input({ required: true })
  isDelivery!: boolean | undefined;
  @Output()
  onQuantityChangeNoneZero: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedNoteOrderProductId: number | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    public cartService: CartService,
    public imageService: ImageService,
    public orderUtils: OrderUtils
  ) {}

  ngOnInit(): void {
    console.log('init');
    console.log(this.cartSummaryModel);

    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartSummaryModel.orderProducts = cart.orderProducts;
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
    this.orderUtils.onQuantityChange(item, this.isDelivery);
    if (item.id) {
      this.onQuantityChangeNoneZero.emit(true);
    }
  }

  onNoteButtonClick(orderProduct: OrderProductDto) {
    this.selectedNoteOrderProductId = orderProduct.id;
  }

  onDelteNote(orderProduct: OrderProductDto) {
    this.selectedNoteOrderProductId = undefined;
    orderProduct.note = undefined;
  }
}
