import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { from, concatMap, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  toaster = inject(ToastrService);
  allIds: any = '';
  wishLisData: IWishlist = {} as IWishlist;

  ngOnInit(): void {
    this.getWishList();
  }

  getWishList(): void {
    this.wishlistService.getProductWishlist().subscribe({
      next: (res) => {
        this.wishLisData = res;
      },
    });
  }

  addProdToWishList(id: string) {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this.toaster.success(res.message, 'Great!🥳', {
          progressBar: true,
          closeButton: true,
        });
      },
    });
  }

  removeItem(id: string): void {
    this.wishlistService.removeWishListItem(id).subscribe({
      next: (res) => {
        this.getWishList();
      },
    });
  }

  addToCart(id: string): void {
    this.cartService.addProductCart(id).subscribe({
      next: (res) => {
        this.toaster.success(res.message);
        this.removeItem(id);
        this.cartService.totalCartItems.next(res.numOfCartItems);
      },
    });
  }

  moveAllToCart() {
    from(this.wishLisData.data)
      .pipe(
        concatMap((item) =>
          this.cartService.addProductCart(item.id).pipe(
            tap((res) => {
              this.cartService.totalCartItems.next(res.numOfCartItems);
            })
          )
        )
      )
      .subscribe({
        complete: () => {
          this.wishLisData.data.forEach((item) => this.removeItem(item.id));
        },
      });
  }
}
