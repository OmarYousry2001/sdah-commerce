import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from '@shared/environments/environment.development';
import { ISettings } from '@shared/models/Settings';
import { SettingsService } from '@shared/services/settings-service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  settings!: ISettings;
  urlImages = environment.urlImages;
  constructor(private _settingsService: SettingsService) {}
  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this._settingsService.getAll().subscribe({
      next: (response) => {
        if (response.data.length === 0) return;
        this.settings = response.data[0];
      },
    });
  }
  @ViewChild('aboutImage') aboutImage!: ElementRef<HTMLImageElement>;

  imageSrc = 'path/to/your/image.jpg';
  imageAlt = 'About us image';

  onMouseMove(event: MouseEvent): void {
    const img = this.aboutImage.nativeElement;
    const { left, top, width, height } = img.getBoundingClientRect();

    const x = (event.clientX - left) / width;
    const y = (event.clientY - top) / height;

    const rotateY = (x - 0.5) * 20; // -10deg to +10deg
    const rotateX = (0.5 - y) * 20; // -10deg to +10deg

    img.style.transform = `
      translateZ(20px) 
      rotateY(${rotateY}deg) 
      rotateX(${rotateX}deg)
      scale(1.03)
    `;

    // Dynamic shadow based on mouse position
    const shadowX = (x - 0.5) * 20;
    const shadowY = (y - 0.5) * 20;
    img.style.boxShadow = `
      ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.3),
      0 0 60px rgba(255, 255, 255, 0.1) inset
    `;
  }

  onMouseLeave(): void {
    const img = this.aboutImage.nativeElement;
    img.style.transform = 'translateZ(0) rotateY(0) rotateX(0) scale(1)';
    img.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
  }
}
