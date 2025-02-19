import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal, WritableSignal } from '@angular/core';
import { api_url } from '../../custom_injections/apiUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishListCount: WritableSignal<number> = signal(0);

  constructor(
    private httpCLient: HttpClient,
    @Inject(api_url) private apiPath: string
  ) {}

  addProductToWishlist(productId: string): Observable<any> {
    return this.httpCLient.post(`${this.apiPath}/wishlist`, {
      productId: productId,
    });
  }

  getProductWishlist(): Observable<any> {
    return this.httpCLient.get(`${this.apiPath}/wishlist`);
  }

  removeWishListItem(productId: string): Observable<any> {
    return this.httpCLient.delete(`${this.apiPath}/wishlist/${productId}`);
  }
}
