import { BehaviorSubject } from 'rxjs';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { CartService } from './../../core/services/cart/cart.service';
import { AuthService } from './../../core/services/auth/auth.service';
import {
  Component,
  computed,
  HostListener,
  inject,
  input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  Signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Search,
  Heart,
  CircleUserRound,
  ShoppingBag,
  LogIn,
  LogOut,
} from 'lucide-angular';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [
    LucideAngularModule,
    RouterLink,
    RouterLinkActive,
    BadgeModule,
    OverlayBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private renderer: Renderer2) {}
  isScroll: boolean = false;
  readonly Search = Search;
  readonly Heart = Heart;
  readonly CircleUserRound = CircleUserRound;
  readonly ShoppingBag = ShoppingBag;
  readonly LogIn = LogIn;
  readonly LogOut = LogOut;
  currency = CurrencyPipe;
  isDropdownOpen = false;
  isLogin = input<boolean>(false);
  authService = inject(AuthService);
  wishListService = inject(WishlistService);
  cartService = inject(CartService);
  id = inject(PLATFORM_ID);

  totalPrice: number = 0;
  count = 1;

  cartProducts: any[] = [];
  wishListCount: Signal<number> = computed(() =>
    this.wishListService.wishListCount()
  );

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event']) hideDropDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.getElementById('dropDown');
    const profileIcon = document.getElementById('CircleUserRound');

    if (!profileIcon?.contains(target) && !dropdown?.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('window:scroll') onScroll() {
    if (scrollY > 600) {
      this.isScroll = true;
    } else if (scrollY == 0) {
      this.isScroll = false;
    }
  }

  themeMode(): void {
    if (isPlatformBrowser(this.id)) {
      const html = document.querySelector('html');

      if (html) {
        const isLightOrAuto = localStorage.getItem('hs_theme') === 'light';
        const isDarkOrAuto = localStorage.getItem('hs_theme') === 'dark';

        if (isLightOrAuto && html.classList.contains('dark')) {
          this.renderer.removeClass(html, 'dark');
        } else if (isDarkOrAuto && html.classList.contains('light')) {
          this.renderer.removeClass(html, 'light');
        } else if (isDarkOrAuto && !html.classList.contains('dark')) {
          this.renderer.addClass(html, 'dark');
        } else if (isLightOrAuto && !html.classList.contains('light')) {
          this.renderer.addClass(html, 'light');
        }
      } else {
        console.error('HTML element not found!');
      }
    }
  }

  ngOnInit(): void {
    this.themeMode();
    this.getWishList();
  }

  deleteItem(productId: string): void {
    if (isPlatformBrowser(this.id) && this.isLogin()) {
      if (localStorage.getItem('token')) {
        this.cartService.removeItem(productId).subscribe({
          next: (res) => {
            this.cartProducts = res.data.products;
            this.totalPrice = res.data.totalCartPrice;
            this.cartService.totalCartItems.next(res.numOfCartItems);
          },
        });
      }
    }
  }

  increment(product: any) {
    product.count++;
  }

  decrement(product: any) {
    if (product.count > 0) {
      product.count--;
    }
  }

  openNav(): void {
    const btn = document.getElementById('navbar-ctaa');
    if (btn?.classList.contains('hidden')) {
      btn?.classList.remove('hidden');
    } else {
      btn?.classList.add('hidden');
    }
  }

  getWishList(): void {
    this.wishListService.getProductWishlist().subscribe({
      next: (res) => {
        this.wishListService.wishListCount.set(res.count);
      },
    });
  }
}
