import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { api_url } from '../../custom_injections/apiUrl';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  totalCartItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private cartItems: WritableSignal<any[]> = signal<any[]>([]);
  private totalPrice: WritableSignal<number> = signal<number>(0);
  private totalItems = signal<number>(0);

  constructor(
    private httpClient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {
    this.getUserCart().subscribe({
      next: (res) => {
        this.totalCartItems.next(res.numOfCartItems);
      },
    });
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  getTotalPrice() {
    return this.totalPrice.asReadonly();
  }

  getTotalItems() {
    return this.totalItems.asReadonly();
  }

  addProductCart(productId: string): Observable<any> {
    return this.httpClient.post(`${this.apiPath}/cart`, {
      productId: productId,
    });
  }

  getUserCart(): Observable<any> {
    return this.httpClient.get(`${this.apiPath}/cart`);
  }

  removeItem(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiPath}/cart/${id}`);
  }

  uptadeQuantity(id: string, count: number): Observable<any> {
    return this.httpClient.put(`${this.apiPath}/cart/${id}`, {
      count: count,
    });
  }

  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiPath}/products`);
  }

  updateCart(items: any[], totalPrice: number, totalItems: number) {
    this.cartItems.set(items);
    this.totalPrice.set(totalPrice);
    this.totalItems.set(totalItems);
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(`${this.apiPath}/cart`);
  }
}
