import { ProductsService } from './../../core/services/products/products.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from './../../core/services/cart/cart.service';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { OrdersService } from '../../core/services/order/orders.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [
    StepperModule,
    ButtonModule,
    CurrencyPipe,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  currency = CurrencyPipe;
  cartId: string = '';
  cartOwner: string = '';
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  cartProducts: any[] = [];
  products: any[] = [];
  orders: any = '';
  private productsService = inject(ProductsService);
  private ordersService = inject(OrdersService);
  private formBuilder = inject(FormBuilder);
  private wishlistService = inject(WishlistService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  selectedPaymentMethod: string = '';
  isWishListed: WritableSignal<any> = signal('');
  isClicked: boolean = false;

  constructor(public cartService: CartService) {}

  getCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (res) => {
        this.cartProducts = res.data.products;
        this.cartProducts = res.data.products.map((product: any) => ({
          ...product,
          count: 1,
        }));
        this.totalPrice.next(res.data.totalCartPrice);
        this.cartService.totalCartItems.next(res.numOfCartItems);
        this.cartId = res.cartId;
        localStorage.setItem('cartOwner', res.data.cartOwner);
      },
    });
  }

  ngOnInit(): void {
    this.getCart();
    this.getData();

    const savedPaymentMethod = localStorage.getItem('payment');
    if (savedPaymentMethod) {
      this.selectedPaymentMethod = savedPaymentMethod;
    }
    this.getWishList();
  }

  deleteItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: (res) => {
        this.totalPrice.next(res.data.totalCartPrice);
        this.cartProducts = res.data.products;
        this.cartService.totalCartItems.next(res.numOfCartItems);
      },
    });
  }

  uptadeQuantity(id: string, count: number): void {
    this.cartService.uptadeQuantity(id, count).subscribe({
      next: (res) => {
        this.cartProducts = res.data.products;
        this.cartService.totalCartItems.next(res.numOfCartItems);
        this.totalPrice.next(res.data.totalCartPrice);
      },
    });
  }

  addToCart(id: string): void {
    this.cartService.addProductCart(id).subscribe({
      next: (res) => {},
    });
  }

  getData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      },
    });
  }

  checkOutForm: FormGroup = this.formBuilder.group({
    details: [null, [Validators.required, Validators.minLength(10)]],
    phone: [null, [Validators.required]],
    city: [null, [Validators.required]],
  });

  submitData(): void {
    if (this.checkOutForm.valid) {
      if (localStorage.getItem('payment') === 'cash') {
        this.ordersService
          .cashOrder(this.cartId, this.checkOutForm.value)
          .subscribe({
            next: (res) => {
              this.router.navigate(['/allorders']);
              this.cartService.totalCartItems.next(0);
              localStorage.removeItem('payment');
            },
            error: (err) => {
              this.toastr.error(err.error.message, 'Wait!');
            },
          });
      } else if (localStorage.getItem('payment') === 'online') {
        this.ordersService
          .OnlinePayment(this.cartId, this.checkOutForm.value)
          .subscribe({
            next: (res) => {
              this.cartService.totalCartItems.next(0);
              open(res.session.url, '_self');
              localStorage.removeItem('payment');
            },
          });
      }
    } else {
      this.toastr.error('You must Enter the Details first..', 'Wait!');
    }
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    localStorage.setItem('payment', method);
  }

  addProdToWishList(id: string) {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Great!🥳', {
          progressBar: true,
          closeButton: true,
        });
        this.toggleWishlist(id);
        if (this.isWishListed().includes(id)) {
          this.isClicked = true;
        }
      },
    });
  }

  getWishList(): void {
    this.wishlistService.getProductWishlist().subscribe({
      next: (res) => {
        this.isWishListed.set(res.data);
        this.wishlistService.wishListCount.set(res.count);
      },
    });
  }

  toggleWishlist(productId: string): void {
    const index = this.isWishListed().indexOf(productId);
    console.log(index);
    if (index > 0) {
      this.isWishListed().splice(index, 1);
    } else {
      this.isWishListed().push(productId);
    }
  }

  isProductWishlisted(productId: string): boolean {
    return this.isWishListed().includes(productId);
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (res) => {
        this.cartService.totalCartItems.next(0);
        this.cartProducts = res.data;
        this.totalPrice.next(0);
      },
    });
  }
}
