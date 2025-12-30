import { computed, Injectable, signal } from '@angular/core';
import { NavigationConfig, NavigationSection } from '../models/navigation.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
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

  // Active section (selected main nav tab)
  activeSection = signal<string>('settings');

  // Get all main navigation sections
  mainNavigation = computed(() => this.navigationConfig().mainNav);

  // Get children for active section
  activeSectionChildren = computed(() => {
    const activeSectionId = this.activeSection();
    const section = this.navigationConfig().mainNav.find((nav) => nav.id === activeSectionId);
    return section?.children || [];
  });

  /**
   * Set the active navigation section
   * This is typically called when user clicks on main nav tabs
   */
  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  /**
   * Load navigation configuration from backend
   * This method should be called during app initialization
   * to fetch navigation structure from API
   */
  async loadNavigationFromBackend(): Promise<void> {
    // TODO: Replace with actual API call
    // const config = await this.http.get<NavigationConfig>('/api/navigation').toPromise();
    // this.navigationConfig.set(config);

    // For now, we use the hardcoded config above
    console.log('Navigation loaded from local configuration');
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
