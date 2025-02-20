import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart/cart.service';
import { from, concatMap, tap, catchError, of, forkJoin } from 'rxjs';

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
        this.wishlistService.wishListCount.set(res.count);
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
        this.wishlistService.wishListCount.set(res.count);
      },
    });
  }

  isProcessing: boolean = false;

  moveAllToCart() {
    this.isProcessing = true;

    const moveObservables = this.wishLisData.data.map((item) =>
      this.cartService.addProductCart(item.id)
    );

    forkJoin(moveObservables).subscribe({
      next: (responses) => {
        const totalCartItems = responses.reduce(
          (sum, res) => sum + res.numOfCartItems,
          0
        );
        this.cartService.totalCartItems.next(totalCartItems);

        const totalWishlistCount = responses.reduce(
          (sum, res) => sum + res.count,
          0
        );
        this.wishlistService.wishListCount.set(totalWishlistCount);
      },
      complete: () => {
        this.wishLisData.data.forEach((item) => this.removeItem(item.id));
        this.isProcessing = false;
      },
      error: () => {
        this.isProcessing = false;
      },
    });
  }
}
