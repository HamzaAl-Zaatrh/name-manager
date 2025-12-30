import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavigationConfig, NavigationSection } from '../models/navigation.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // This configuration can be replaced with data from backend API
  private navigationConfig = signal<NavigationConfig>({
    mainNav: [
      {
        id: 'dashboard',
        label: 'لوحة القيادة',
        route: '/portal/dashboard',
        children: [],
      },
      {
        id: 'settings',
        label: 'اعدادات النظام',
        route: '/portal/settings',
        children: [
          {
            id: 'transactions',
            label: 'إدارة المعاملات',
            children: [
              {
                id: 'external-investors',
                label: 'مجموعة المستثمرين للجهات الخارجية',
                route: '/portal/settings/external-investors',
              },
            ],
          },
        ],
      },
    ],
  });

  // Active section (selected main nav tab) - derived from current URL
  activeSection = computed(() => {
    const url = this.currentUrl();
    const section = this.getSectionByRoute(url);
    return section?.id || '';
  });

  // Get all main navigation sections
  mainNavigation = computed(() => this.navigationConfig().mainNav);

  // Get children for active section
  activeSectionChildren = computed(() => {
    const activeSectionId = this.activeSection();
    const section = this.navigationConfig().mainNav.find((nav) => nav.id === activeSectionId);
    return section?.children || [];
  });

  /**
   * Load navigation configuration from backend
   * This method should be called during app initialization
   * to fetch navigation structure from API
   */
  async loadNavigationFromBackend(): Promise<void> {
    // const config = await this.http.get<NavigationConfig>('/api/navigation').toPromise();
    // this.navigationConfig.set(config);
  }

  /**
   * Update navigation configuration (for backend integration)
   */
  updateNavigationConfig(config: NavigationConfig): void {
    this.navigationConfig.set(config);
  }

  /**
   * Get navigation section by route
   * Useful for setting active section based on current route
   */
  getSectionByRoute(route: string): NavigationSection | undefined {
    return this.navigationConfig().mainNav.find((section) => route.startsWith(section.route || ''));
  }
}
