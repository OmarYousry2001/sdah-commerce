import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { IdentityService } from '@shared/services/identity-service';
import { SettingsService } from '@shared/services/settings-service';
import { ISettings } from '@shared/models/Settings';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  visible: boolean = false;
  userName: string = '';
  isAuthenticated: boolean = false;
  mobileMenuOpen = false;
  settings!: ISettings;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  constructor(
    private _identityService: IdentityService,
    private router: Router,
    private _settingsService: SettingsService
  ) {}
  ngOnInit(): void {
    this.isUserAuthenticated();
    this.loadSettings();
  }
  // Load  settings
  loadSettings(): void {
    this._settingsService.getAll().subscribe({
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

  ToggleDropDown() {
    this.visible = !this.visible;
  }

  logout() {
    this._identityService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/login');
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  isUserAuthenticated() {
    this._identityService.isUserAuthenticated().subscribe({
      next: (value) => {
        this.isAuthenticated = value;

        // console.log('User Authenticated:', this.isAuthenticated);
      },
    });
  }
}
