import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { apiErrorMessage } from './api-error';
import { ItemRecord, StockApi, TitleRecord } from './stock-api';

@Component({
  selector: 'app-catalog-page',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog-page.html',
})
export class CatalogPage {
  private readonly api = inject(StockApi);
  private readonly destroyRef = inject(DestroyRef);
  readonly titles = signal<TitleRecord[]>([]);
  readonly items = signal<ItemRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly name = signal('');
  readonly category = signal('');
  readonly actor = signal('');
  readonly categories = computed(() => [...new Set(this.titles().map((title) => title.category))].sort());
  readonly itemCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const item of this.items()) counts.set(item.titleId, (counts.get(item.titleId) ?? 0) + 1);
    return counts;
  });
  readonly filtered = computed(() => {
    const name = this.name().trim().toLocaleLowerCase('pt-BR');
    const actor = this.actor().trim().toLocaleLowerCase('pt-BR');
    return this.titles().filter((title) => title.name.toLocaleLowerCase('pt-BR').includes(name)
      && (!this.category() || title.category === this.category())
      && (!actor || title.actors.some((person) => person.name.toLocaleLowerCase('pt-BR').includes(actor))));
  });

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set('');
    forkJoin({ titles: this.api.listTitles(), items: this.api.listItems() })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => { this.titles.set(data.titles); this.items.set(data.items); this.loading.set(false); },
        error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); },
      });
  }
}
