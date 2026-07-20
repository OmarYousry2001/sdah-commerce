import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ISettings } from '@shared/models/Settings';
import { environment } from '../../../environments/environment.development';
import { SettingsService } from '@shared/services/settings-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {
  settings: ISettings[] = [];
  urlImages: string = environment.urlImages;

  constructor(
    private _settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this._settingsService.getAll().subscribe({
      next: (response) => {
        this.settings = response.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
