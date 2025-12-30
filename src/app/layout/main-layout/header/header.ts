import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLinkActive, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  navigationService = inject(NavigationService);
  router = inject(Router);

  mainNavigation = this.navigationService.mainNavigation;
}
