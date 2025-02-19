import { CartService } from './../../core/services/cart/cart.service';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  QueryList,
  signal,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { MoreProdService } from '../../core/services/moreProd/more-prod.service';
import { SortPipe } from '../../shared/pipes/sort/sort.pipe';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-products',
  imports: [SortPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductsComponent {
  private readonly moreProdService = inject(MoreProdService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);
  @ViewChildren('productCard') productCards!: QueryList<ElementRef>;
  imageNativeElement: any;
  lensNativeElement: any;
  container: any;
  zoomLevel = 1.5;

  allProducts: any[] = [];
  allCategory: any[] = [];
  categoryName: string = '';
  categoryProd: any = null;
  currentPage: number = 1;
  next: number = 2;
  limit: number = 40;
  selectedCategory: string = 'All Products';
  sortOrder: 'asc' | 'desc' = 'asc';
  isClicked: boolean = false;
  isWishListed: WritableSignal<any> = signal('');

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts(this.currentPage);
    this.getWishList();
  }

  loadProducts(page: number): void {
    this.moreProdService.getAllProducts(page, this.limit).subscribe({
      next: (res) => {
        this.allProducts = res.data;
        this.currentPage = res.metadata.currentPage;
        this.next = res.metadata.nextPage;
      },
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.allCategory = res.data;
      },
    });
  }

  nextPage(): void {
    if (this.next) {
      this.loadProducts(this.next);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  getCategoryId(catId: string): void {
    this.moreProdService.getProdByCateogry(catId).subscribe({
      next: (res) => {
        this.categoryProd = res.data;
      },
    });
  }

  onCategoryClick(category: string): void {
    this.selectedCategory = category;
  }

  sortByPrice(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
  }

  addToCart(pId: string): void {
    this.cartService.addProductCart(pId).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Success', {
          progressBar: true,
        });
        this.cartService.totalCartItems.next(res.numOfCartItems);
      },
    });
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
        this.getWishList();
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
    if (index > 0) {
      this.isWishListed().splice(index, 1);
    } else {
      this.isWishListed().push(productId);
    }
  }

  isProductWishlisted(productId: string): boolean {
    return this.isWishListed().includes(productId);
  }

  closerLook() {
    if (this.productCards) {
      this.productCards?.forEach((card: ElementRef) => {
        const cardNativeElement = card.nativeElement as HTMLElement;

        const image = cardNativeElement.querySelector(
          '.product-image'
        ) as HTMLImageElement;
        const lens = cardNativeElement.querySelector('.lens') as HTMLDivElement;
        const container = cardNativeElement.querySelector(
          '.image-container'
        ) as HTMLDivElement;
        container.addEventListener('mousemove', (e: MouseEvent) => {
          this.moveLens(e, image, lens);
        });

        container.addEventListener('mouseleave', () => this.hideLens(lens));
      });
    }
  }

  moveLens(e: MouseEvent, image: HTMLImageElement, lens: HTMLDivElement) {
    const x = e.offsetX;
    const y = e.offsetY;

    const lensX = x - lens.offsetWidth / 2;
    const lensY = y - lens.offsetHeight / 2;

    const maxX = image.width - lens.offsetWidth;
    const maxY = image.height - lens.offsetHeight;

    const clampedX = Math.max(0, Math.min(maxX, lensX));
    const clampedY = Math.max(0, Math.min(maxY, lensY));

    lens.style.left = clampedX + 'px';
    lens.style.top = clampedY + 'px';

    const bgPosX = -clampedX * this.zoomLevel;
    const bgPosY = -clampedY * this.zoomLevel;

    lens.style.backgroundImage = `url(${image.src})`;
    lens.style.backgroundSize = `${image.width * this.zoomLevel}px ${
      image.height * this.zoomLevel
    }px`;
    lens.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
  }

  hideLens(lens: HTMLDivElement) {
    lens.style.backgroundImage = 'none';
  }
}
