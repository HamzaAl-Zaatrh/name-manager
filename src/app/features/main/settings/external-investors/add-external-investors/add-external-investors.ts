import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExternalInvestor } from '@core/models/external-investor.model';

@Component({
  selector: 'app-add-external-investors',
  imports: [ReactiveFormsModule],
  templateUrl: './add-external-investors.html',
  styleUrl: './add-external-investors.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExternalInvestors {
  mode = input.required<'add' | 'edit'>();
  investor = input<ExternalInvestor | undefined>();
  submitForm = output<{ name: string; description: string }>();
  cancel = output<void>();

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  constructor() {
    effect(() => {
      const record = this.investor();
      if (record && this.mode() === 'edit') {
        this.form.patchValue({
          name: record.name,
          description: record.description,
        });
      } else if (this.mode() === 'add') {
        this.form.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value as { name: string; description: string });
      this.form.reset();
    }
  }

  onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }
}
