import { ICategory } from '@shared/models/Category';
import { CategoryService } from '@shared/services/category-service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  imports: [RouterLink],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category implements OnInit {
  categories: ICategory[] = [];
  constructor(
    private _categoryService: CategoryService,
    private _toaService: ToastrService
  ) {}
  ngOnInit(): void {
    this._categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('Failed to load categories', 'Error');
      },
    });
  }

  deleteCategory(id: string) {
    this._categoryService.Delete(id).subscribe({
      next: (response) => {
        this.categories = this.categories.filter((c) => c.id !== id);
        this._toaService.success(response.message, 'Success');
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('Failed to delete category', 'Error');
      },
    });
  }
}
