import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { apiErrorMessage } from './api-error';
import { ItemRecord, ItemType, StockApi, TitleRecord, itemTypes } from './stock-api';

@Component({
  selector: 'app-title-page',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './title-page.html',
})
export class TitlePage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(StockApi);
  private readonly destroyRef = inject(DestroyRef);
  private request?: Subscription;
  readonly title = signal<TitleRecord | null>(null);
  readonly items = signal<ItemRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly actors = computed(() => this.title()?.actors.map((actor) => actor.name).join(', ') ?? '');

  constructor() { this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => this.load()); }

  typeLabel(type: ItemType): string { return itemTypes.find((option) => option.value === type)?.label ?? type; }

  load(): void {
    this.request?.unsubscribe();
    this.title.set(null); this.items.set([]); this.error.set('');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) { this.loading.set(false); this.error.set('Título não encontrado.'); return; }
    this.loading.set(true);
    this.request = forkJoin({ title: this.api.getTitle(id), items: this.api.listItems({ titleId: id }) })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => { this.title.set(data.title); this.items.set(data.items); this.loading.set(false); },
        error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); },
      });
  }
}
