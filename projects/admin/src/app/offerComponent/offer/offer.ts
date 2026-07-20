import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@shared/environments/environment.development';
import { IGetOffer, IOffer } from '@shared/models/Offer';
import { ToastrService } from 'ngx-toastr';
import { OfferService } from '@shared/services/offer-service';

@Component({
  selector: 'app-offer',
  imports: [RouterLink, CommonModule],
  templateUrl: './offer.html',
  styleUrl: './offer.scss',
})
export class Offer implements OnInit {
  offers: IGetOffer[] = [];
  urlImages: string = environment.urlImages;
  constructor(
    private _offerService: OfferService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this._offerService.getAll().subscribe({
      next: (res) => {
        console.log(res.data);
        this.offers = res.data;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('حدث خطأ أثناء تحميل العروض', 'خطأ');
      },
    });
  }

  deleteOffer(id: string): void {
    this._offerService.delete(id).subscribe({
      next: (res) => {
        this.toastr.success('تم حذف العرض بنجاح', 'نجاح');
        this.offers = this.offers.filter((x) => x.id !== id);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('فشل في حذف العرض', 'خطأ');
      },
    });
  }
}
