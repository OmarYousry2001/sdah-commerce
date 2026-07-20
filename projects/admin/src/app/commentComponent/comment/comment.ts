import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IComment } from '@shared/models/Comment';
import { CommentService } from '@shared/services/comment-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment',
  imports: [RouterLink, CommonModule],
  templateUrl: './comment.html',
  styleUrl: './comment.scss',
})
export class Comment implements OnInit {
  comments: IComment[] = [];
  constructor(
    private _commentService: CommentService,
    private _toaService: ToastrService
  ) {}
  ngOnInit(): void {
    this._commentService.getAll().subscribe({
      next: (response) => {
        console.log(response.data);
        this.comments = response.data;
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('خطأ أثناء جلب البيانات', 'خطأ');
      },
    });
  }

  delete(id: string) {
    this._commentService.delete(id).subscribe({
      next: (response) => {
        this.comments = this.comments.filter((c) => c.id !== id);
        this._toaService.success(response.message, 'نجح');
      },
      error: (err) => {
        console.log(err);
        this._toaService.error('حدث خطأ أثناء الحذف', 'خطأ');
      },
    });
  }
}
