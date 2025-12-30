import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-delete-confirmation',
  imports: [Modal],
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmation {
  isOpen = input.required<boolean>();
  itemName = input.required<string>();
  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
