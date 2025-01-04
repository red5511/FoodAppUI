import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-custom-toast',
  template: `
    <div>
      Otrzymałeś nowe zamówienie #{{ orderId }}.
      <button class="btn btn-primary" (click)="onViewOrder()">Zobacz zamówienie</button>
    </div>
  `,
  styles: [
    `
      .btn {
        margin-top: 10px;
        color: #fff;
        background-color: #007bff;
        border: none;
        cursor: pointer;
      }

      .btn:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class CustomToastComponent {
  orderId!: number;
  constructor(private router: Router) {}

  onViewOrder() {
    this.router.navigate(['/orders']);
  }
}
