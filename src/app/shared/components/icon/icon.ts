import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  private readonly spritePath = '/icons/svg/sprite.css.svg';

  name = input.required<string>();
  size = input<IconSize>('medium');
  customSize = input<number>();
  color = input<string>(); // For CSS class like 'primary', 'danger', etc.

  protected iconPath = computed(() => `${this.spritePath}#${this.name()}`);

  protected getClasses = computed(() => {
    const classes: string[] = [];
    if (this.color()) {
      classes.push(`icon--${this.color()}`);
    }
    return classes;
  });

  protected sizePx = computed(() => {
    if (this.customSize()) {
      return this.customSize();
    }

    switch (this.size()) {
      case 'tiny':
        return 12;
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      case 'huge':
        return 48;
      default:
        return 24;
    }
  });
}
