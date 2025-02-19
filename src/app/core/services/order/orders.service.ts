import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_url } from '../../custom_injections/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}

  cashOrder(cartID: string, data: object): Observable<any> {
    return this.httpClient.post(`${this.apiPath}/orders/${cartID}`, {
      shippingAddress: data,
    });
  }

  OnlinePayment(cartID: string, data: object): Observable<any> {
    return this.httpClient.post(
      `${this.apiPath}/orders/checkout-session/${cartID}?url=https://nexus-ecommerce-a42d1.web.app`,
      {
        shippingAddress: data,
      }
    );
  }

  getUserOrders(cartOwner: string): Observable<any> {
    return this.httpClient.get(`${this.apiPath}/orders/user/${cartOwner}`);
  }
}
