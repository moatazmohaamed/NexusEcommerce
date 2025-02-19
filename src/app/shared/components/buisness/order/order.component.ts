import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../../../core/services/order/orders.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [RouterLink, DatePipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  private readonly orderService = inject(OrdersService);
  cartowner = localStorage.getItem('cartOwner');
  cartItem: any = '';
  moreDetails: any = '';

  ngOnInit(): void {
    if (this.cartowner) {
      this.orderService.getUserOrders(this.cartowner).subscribe({
        next: (res) => {
          res.forEach((item: any) => {
            this.cartItem = item.cartItems;
            this.moreDetails = item;
          });
        },
      });
    }
  }
}
