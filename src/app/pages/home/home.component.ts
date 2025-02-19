import { CartService } from './../../core/services/cart/cart.service';
import { ICategory } from './../../shared/interfaces/icategory';
import { CategoriesService } from './../../core/services/categories/categories.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  LucideAngularModule,
  Truck,
  ShieldQuestion,
  CircleDollarSign,
  Eye,
  Heart,
} from 'lucide-angular';
import { ProductsService } from '../../core/services/products/products.service';
import { IProducts } from '../../shared/interfaces/iproducts';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ButtonModule } from 'primeng/button';
import { ScrollTopModule } from 'primeng/scrolltop';
import { RouterLink } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-home',
  imports: [
    LucideAngularModule,
    CarouselModule,
    ButtonModule,
    RouterLink,
    ScrollTopModule,
    ToastrModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  @ViewChildren('productCard') productCards!: QueryList<ElementRef>;
  imageNativeElement: any;
  lensNativeElement: any;
  container: any;
  zoomLevel = 1.5;
  readonly Truck = Truck;
  readonly Heart = Heart;
  readonly ShieldQuestion = ShieldQuestion;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Eye = Eye;
  private readonly productServices = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly wishlistService = inject(WishlistService);

  products: IProducts[] = [];
  categories: ICategory[] = [];
  cartMsg: string = '';
  isClicked: boolean = false;
  isWishListed: WritableSignal<any> = signal('');

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {}

  getData(): void {
    this.productServices.getAllProducts().subscribe({
      next: (res) => {
        this.products = res.data;
      },
    });
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
    });
  }

  // slider
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplaySpeed: 1000,
    dots: true,
    autoHeight: true,
    navSpeed: 0,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 6,
      },
    },
    nav: false,
  };

  breakpoints = {
    0: { slidesPerView: 1, spaceBetween: 1 },
    1000: { slidesPerView: 1, spaceBetween: 40 },
  };

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

  ngOnInit(): void {
    this.getData();
    this.getCategories();
    this.getWishList();
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
}
