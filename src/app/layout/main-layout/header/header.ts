import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  navigationService = inject(NavigationService);
  router = inject(Router);

  mainNavigation = this.navigationService.mainNavigation;
  activeSection = this.navigationService.activeSection;

  onNavClick(sectionId: string): void {
    this.navigationService.setActiveSection(sectionId);

    // Navigate to the section's route
    const section = this.mainNavigation().find((nav) => nav.id === sectionId);
    if (section?.route) {
      this.router.navigate([section.route]);
    }
  }
}
