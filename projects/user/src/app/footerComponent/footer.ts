import { Component, OnInit } from '@angular/core';
import { ISettings } from '@shared/models/Settings';
import { SettingsService } from '@shared/services/settings-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  Settings!: ISettings;
  constructor(private _settingsService: SettingsService) {}
  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this._settingsService.getAll().subscribe({
      next: (response) => {
        if (response.data.length === 0) return;
        this.Settings = response.data[0];
      },
    });
  }
}
