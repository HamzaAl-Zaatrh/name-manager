import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '@app/shared/components/icon/icon';

@Component({
  selector: 'app-modal',
  imports: [Icon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  title = input.required<string>();
  isOpen = input.required<boolean>();
  close = output<void>();

  onBackdropClick(): void {
    this.close.emit();
  }

  onCloseClick(): void {
    this.close.emit();
  }
}
