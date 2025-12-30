import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExternalInvestorsService } from '@core/services/external-investors.service';
import { ExternalInvestor } from '@core/models/external-investor.model';
import { AddExternalInvestors } from '@app/features/main/settings/external-investors/add-external-investors/add-external-investors';
import { Modal } from '@app/shared/components/modal/modal';
import { DeleteConfirmation } from '@app/shared/components/delete-confirmation/delete-confirmation';
import { Icon } from '@app/shared/components/icon/icon';

@Component({
  selector: 'app-external-investors',
  imports: [AddExternalInvestors, Modal, DeleteConfirmation, Icon],
  templateUrl: './external-investors.html',
  styleUrl: './external-investors.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalInvestors {
  investorsService = inject(ExternalInvestorsService);

  // State signals
  investors = toSignal(this.investorsService.filteredInvestors$, { initialValue: [] });
  searchTerm = signal('');
  isAddModalOpen = signal(false);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  selectedInvestor = signal<ExternalInvestor | null>(null);

  // Search
  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.investorsService.setFilter(value);
  }

  // Add operations
  openAddModal(): void {
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  onAddSubmit(data: { name: string; description: string }): void {
    this.investorsService.addInvestor(data);
    this.closeAddModal();
  }

  // Edit operations
  onEditClick(investor: ExternalInvestor): void {
    this.selectedInvestor.set(investor);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedInvestor.set(null);
  }

  onEditSubmit(data: { name: string; description: string }): void {
    const investor = this.selectedInvestor();
    if (investor) {
      this.investorsService.updateInvestor(investor.id, data);
      this.closeEditModal();
    }
  }

  // Delete operations
  onDeleteClick(id: string): void {
    const investor = this.investors().find((inv) => inv.id === id);
    if (investor) {
      this.selectedInvestor.set(investor);
      this.isDeleteModalOpen.set(true);
    }
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedInvestor.set(null);
  }

  onDeleteConfirm(): void {
    const investor = this.selectedInvestor();
    if (investor) {
      this.investorsService.deleteInvestor(investor.id);
      this.closeDeleteModal();
    }
  }
}
