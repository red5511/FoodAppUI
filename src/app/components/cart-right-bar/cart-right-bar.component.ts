import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CartModel } from '../../common/commonModels';
import { OrderProductDto } from '../../services/models';
import { OrderUtils } from '../../common/orders-utils';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-cart-right-bar',
  templateUrl: './cart-right-bar.component.html',
  styleUrl: './cart-right-bar.component.scss',
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-55px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(55px)' })
        ),
      ]),
    ]),
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
export class CartRightBarComponent {
  @Input({ required: true })
  isBodyCartRightBar!: boolean;
  @Input({ required: true })
  totalItems: number = 0;
  @Input({ required: true })
  totalPrice: number = 0;
  @Input({ required: true })
  cartModel!: CartModel;
  @Output() onSummaryPanelVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  showEmpty: boolean = false;
  animationDuration: number = 300; // ms, should match your animation timing

  constructor(public orderUtils: OrderUtils) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');

    if (this.cartModel.orderProducts.length === 0) {
      // Delay showing the empty state until after the removal animations
      setTimeout(() => {
        this.showEmpty = true;
      }, this.animationDuration);
    } else {
      // Hide the empty state immediately when items are present
      this.showEmpty = false;
    }
  }

  toggleNote(item: OrderProductDto): void {
    if (item.note === undefined) {
      item.note = ''; // Initialize an empty string if no note exists
    } else {
      item.note = undefined; // Clear the note when removing
    }
  }

  onSummaryClick() {}

  trackById(index: number, item: OrderProductDto): number | undefined {
    //potrzebne zeby animacja dzialal porawnie
    return item.id;
  }
}
