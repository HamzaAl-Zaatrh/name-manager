import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { NavigationItem } from '@core/models/navigation.model';
import { Icon } from '@app/shared/components/icon/icon';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  navigationService = inject(NavigationService);

  isOpen = signal(true);
  activeSectionChildren = this.navigationService.activeSectionChildren;
  hasSidebarChildren = computed(() => this.activeSectionChildren().length > 0);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  // Helper method to check if item has children (nested navigation)
  hasChildren(item: NavigationItem): boolean {
    return !!item.children && item.children.length > 0;
  }
}
