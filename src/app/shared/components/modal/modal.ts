import { ChangeDetectionStrategy, Component, effect, ElementRef, input, output, viewChild } from '@angular/core';
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

  readonly dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialogElement');

  constructor() {
    // Effect to sync isOpen signal with dialog state
    effect(() => {
      const dialogRef = this.dialogElement();
      if (!dialogRef) return;

      const dialog = dialogRef.nativeElement;

      if (this.isOpen()) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    });
  }

  onCloseClick(): void {
    this.close.emit();
  }
}
