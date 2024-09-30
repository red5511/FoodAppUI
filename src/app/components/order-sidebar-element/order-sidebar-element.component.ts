import { Component, Input } from '@angular/core';
import { OrderDto } from '../../services/models';

@Component({
  selector: 'app-order-sidebar-element',
  templateUrl: './order-sidebar-element.component.html',
  styleUrl: './order-sidebar-element.component.scss'
})
export class OrderSidebarElementComponent {
  @Input() order!: OrderDto

}
