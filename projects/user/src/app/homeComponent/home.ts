import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@shared/services/settings-service';
import { ISettings } from '@shared/models/Settings';
import { environment } from '@shared/environments/environment.development';
import { CommentService } from '@shared/services/comment-service';
import { ICommentPublic } from '@shared/models/Comment';
import { OfferService } from '@shared/services/offer-service';
import { IGetOffer } from '@shared/models/Offer';
import { BasketService } from '../basketComponent/basketservice';
import { IGetProduct } from '@shared/models/Product';
import { ProductService } from '@shared/services/product-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  settings!: ISettings;
  comments!: ICommentPublic[];
  currentTestimonialIndex = 0;
  urlImages = environment.urlImages;
  private testimonialInterval!: Subscription;
  offer: any;
  offers: IGetOffer[] = [];
  products!: IGetProduct[];

  currentOfferGroupIndex = 0;
  private offerInterval!: Subscription;
  autoSlideEnabled = true;
  offersPerGroup = 3;

  particles: any[] = Array(20).fill(0); // 20 particle

  // In Hero Section
  stats = [
    { number: 5000, label: 'عميل سعيد', icon: 'mood' },
    { number: 500, label: 'منتج', icon: 'inventory_2' },
    { number: 3000, label: 'طلب ناجح', icon: 'shopping_cart' },
  ];

  constructor(
    private settingsService: SettingsService,
    private _commentService: CommentService,
    private _OfferService: OfferService,
    private _basketService: BasketService,
    private _productService: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadComments();
    this.loadOffers();
    this.getNewProduct();
    this.startTestimonialRotation();
    this.startOfferRotation();
  }

  // Load  settings
  loadSettings(): void {
    this.settingsService.getAll().subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.settings = response.data[0];
        }
      },
      error: (error) => {
        console.error('Error loading settings:', error);
      },
    });
  }

  //  Load all  comments (testimonials)
  loadComments() {
    this._commentService.getAllForUser().subscribe({
      next: (response) => {
        this.comments = response.data;
      },
    });
  }

  //  Load all  Offers
  loadOffers() {
    this._OfferService.getAll().subscribe({
      next: (response) => {
        this.offers = response.data;
      },
    });
  }

  //  Load all  New Products
  getNewProduct() {
    this._productService.getAllNew().subscribe({
      next: (response) => {
        this.products = response.data;
      },
    });
  }

  startTestimonialRotation(): void {
    // بدء التمرير التلقائي كل 6 ثواني
    this.testimonialInterval = interval(6000).subscribe(() => {
      this.nextTestimonial();
    });
  }

  nextTestimonial(): void {
    this.currentTestimonialIndex =
      (this.currentTestimonialIndex + 1) % this.comments.length;

    // إعادة تشغيل التمرير التلقائي
    this.restartAutoRotation();
  }

  private restartAutoRotation(): void {
    if (this.testimonialInterval) {
      this.testimonialInterval.unsubscribe();
    }
    this.startTestimonialRotation();
  }

  getDaysAgo(createdDateUtc: string): string {
    const createdDate = new Date(createdDateUtc);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays <= 0) return 'اليوم';
    else if (diffInDays === 1) return 'يوم واحد';
    else if (diffInDays <= 10) return `${diffInDays} أيام`;
    else return `${diffInDays} يوم`;
  }

  toggleModal = function () {
    document.querySelector('.overlay')?.classList.toggle('hidden');
    document.querySelector('.modals')?.classList.toggle('hidden');
  };
  closeModal() {
    this.toggleModal();
  }

  showProduct(id: string) {
    this._router.navigate(['/productDetails', id]);
  }
  getOffers() {
    const element = document.getElementById('Offers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  statsArray = [
    {
      number: 12500,
      label: 'عميل سعيد',
      icon: 'people',
    },
    {
      number: 850,
      label: 'منتج',
      icon: 'inventory_2',
    },
    {
      number: 34500,
      label: 'طلب ناجح',
      icon: 'shopping_cart',
    },
    {
      number: 5,
      label: 'سنوات خبرة',
      icon: 'emoji_events',
    },
  ];

  features = [
    {
      icon: 'local_shipping',
      title: 'توصيل سريع',
      description: 'خدمة توصيل سريعة وموثوقة لجميع أنحاء المملكة',
    },
    {
      icon: 'security',
      title: 'آمن 100%',
      description: 'معاملات آمنة وبيانات محمية بأحدث تقنيات التشفير',
    },
    {
      icon: 'build_circle',
      title: 'خدمة ما بعد البيع',
      description: 'ضمان ودعم مستمر',
    },
    {
      icon: 'verified',
      title: 'جودة مضمونة',
      description: 'منتجات أصلية بجودة عالية وضمان ممتاز',
    },
  ];

  prevTestimonial(): void {
    this.currentTestimonialIndex =
      this.currentTestimonialIndex > 0
        ? this.currentTestimonialIndex - 1
        : this.comments.length - 1;

    // إعادة تشغيل التمرير التلقائي
    this.restartAutoRotation();
  }

  goToTestimonial(index: number): void {
    this.currentTestimonialIndex = index;
    this.restartAutoRotation();
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) {
      this.testimonialInterval.unsubscribe();
    }
    if (this.offerInterval) {
      this.offerInterval.unsubscribe();
    }
  }

  // دوال التمرير التلقائي للعروض (3 في كل مجموعة)
  startOfferRotation(): void {
    this.offerInterval = interval(5000).subscribe(() => {
      if (this.autoSlideEnabled && this.offers.length > 0) {
        this.nextOfferGroup();
      }
    });
  }

  get totalOfferGroups(): number {
    return Math.ceil(this.offers.length / this.offersPerGroup);
  }

  getCurrentOfferGroup(): IGetOffer[] {
    const startIndex = this.currentOfferGroupIndex * this.offersPerGroup;
    return this.offers.slice(startIndex, startIndex + this.offersPerGroup);
  }

  nextOfferGroup(): void {
    if (this.totalOfferGroups > 0) {
      this.currentOfferGroupIndex =
        (this.currentOfferGroupIndex + 1) % this.totalOfferGroups;
    }
  }

  prevOfferGroup(): void {
    if (this.totalOfferGroups > 0) {
      this.currentOfferGroupIndex =
        this.currentOfferGroupIndex > 0
          ? this.currentOfferGroupIndex - 1
          : this.totalOfferGroups - 1;
    }
  }

  goToOfferGroup(index: number): void {
    this.currentOfferGroupIndex = index;
    this.restartOfferRotation();
  }

  toggleAutoSlide(): void {
    this.autoSlideEnabled = !this.autoSlideEnabled;
    if (this.autoSlideEnabled) {
      this.startOfferRotation();
    } else if (this.offerInterval) {
      this.offerInterval.unsubscribe();
    }
  }

  private restartOfferRotation(): void {
    if (this.offerInterval) {
      this.offerInterval.unsubscribe();
    }
    if (this.autoSlideEnabled) {
      this.startOfferRotation();
    }
  }

  getOfferGroup(groupIndex: number): IGetOffer[] {
    const startIndex = groupIndex * this.offersPerGroup;
    return this.offers.slice(startIndex, startIndex + this.offersPerGroup);
  }
}
