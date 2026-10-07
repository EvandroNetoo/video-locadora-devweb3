import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcervoNav } from './acervo-nav';
import { apiErrorMessage, apiFieldErrors } from './api-error';
import { ItemInput, ItemRecord, ItemType, StockApi, TitleRecord, itemTypes } from './stock-api';

@Component({
  selector: 'app-items-page',
  imports: [DatePipe, FormsModule, RouterLink, AcervoNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './items-page.html',
})
export class ItemsPage {
  private readonly api = inject(StockApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private detailRequest?: Subscription;
  private listRequest?: Subscription;
  readonly types = itemTypes;
  readonly records = signal<ItemRecord[]>([]);
  readonly titles = signal<TitleRecord[]>([]);
  readonly selected = signal<ItemRecord | null>(null);
  readonly mode = signal<'idle' | 'new' | 'detail'>('idle');
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly optionsLoading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly busy = computed(() => this.saving() || this.deleting());
  readonly listError = signal('');
  readonly detailError = signal('');
  readonly optionsError = signal('');
  readonly actionError = signal('');
  readonly feedback = signal('');
  readonly fieldErrors = signal<Record<string, string>>({});
  filterSerial = '';
  filterTitleId: number | null = null;
  filterType: ItemType | null = null;
  formSerial = '';
  formTitleId: number | null = null;
  formDate = '';
  formType: ItemType | null = null;

  constructor() {
    this.loadList(); this.loadOptions();
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.detailRequest?.unsubscribe();
      this.detailLoading.set(false); this.selected.set(null);
      this.detailError.set(''); this.actionError.set(''); this.fieldErrors.set({}); this.resetForm();
      if (params.has('novo')) { this.mode.set('new'); return; }
      const id = Number(params.get('id'));
      if (Number.isSafeInteger(id) && id > 0) { this.mode.set('detail'); this.loadDetail(id); return; }
      this.mode.set('idle');
    });
  }

  typeLabel(type: ItemType): string { return this.types.find((option) => option.value === type)?.label ?? type; }

  loadList(): void {
    this.listRequest?.unsubscribe();
    this.loading.set(true); this.listError.set('');
    this.listRequest = this.api.listItems({ serialNumber: this.filterSerial, titleId: this.filterTitleId ?? undefined, type: this.filterType ?? undefined })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (records) => { this.records.set(records); this.loading.set(false); },
        error: (error: unknown) => { this.listError.set(apiErrorMessage(error)); this.loading.set(false); },
      });
  }

  loadOptions(): void {
    this.optionsLoading.set(true); this.optionsError.set('');
    this.api.listTitles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (titles) => { this.titles.set(titles); this.optionsLoading.set(false); },
      error: (error: unknown) => { this.optionsError.set(apiErrorMessage(error)); this.optionsLoading.set(false); },
    });
  }

  retryDetail(): void { this.loadDetail(Number(this.route.snapshot.queryParamMap.get('id'))); }

  private loadDetail(id: number): void {
    this.detailRequest?.unsubscribe();
    this.detailLoading.set(true); this.detailError.set('');
    this.detailRequest = this.api.getItem(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (record) => {
        this.selected.set(record); this.formSerial = record.serialNumber; this.formTitleId = record.titleId;
        this.formDate = record.acquisitionDate; this.formType = record.type; this.detailLoading.set(false);
      },
      error: (error: unknown) => { this.detailError.set(apiErrorMessage(error)); this.detailLoading.set(false); },
    });
  }

  save(form: NgForm): void {
    if (this.busy() || this.optionsLoading() || this.optionsError() || !this.titles().length) return;
    form.form.markAllAsTouched();
    if (form.invalid || !this.formTitleId || !this.formType) return;
    if (!this.formSerial.trim()) { this.fieldErrors.set({ serialNumber: 'Informe o número de série.' }); return; }
    const input: ItemInput = { serialNumber: this.formSerial.trim(), titleId: this.formTitleId, acquisitionDate: this.formDate, type: this.formType };
    const current = this.selected();
    if (this.mode() === 'detail' && !current) return;
    this.saving.set(true); this.actionError.set(''); this.fieldErrors.set({}); this.feedback.set('');
    const request = current ? this.api.updateItem(current.id, input) : this.api.createItem(input);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.saving.set(false); this.feedback.set('Item salvo com sucesso.'); this.loadList(); void this.router.navigate(['/acervo/itens']); },
      error: (error: unknown) => { this.saving.set(false); this.captureError(error); },
    });
  }

  remove(dialog: HTMLDialogElement): void {
    const current = this.selected();
    if (!current || this.busy()) return;
    this.deleting.set(true); this.actionError.set(''); this.feedback.set('');
    this.api.deleteItem(current.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.deleting.set(false); dialog.close(); this.feedback.set('Item excluído com sucesso.'); this.loadList(); void this.router.navigate(['/acervo/itens']); },
      error: (error: unknown) => { this.deleting.set(false); dialog.close(); this.captureError(error); },
    });
  }

  private resetForm(): void { this.formSerial = ''; this.formTitleId = null; this.formDate = ''; this.formType = null; }
  private captureError(error: unknown): void { this.fieldErrors.set(apiFieldErrors(error)); this.actionError.set(apiErrorMessage(error)); }
}
