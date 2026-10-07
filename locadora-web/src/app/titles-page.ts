import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { AcervoNav } from './acervo-nav';
import { apiErrorMessage, apiFieldErrors } from './api-error';
import { ReferenceApi, ReferenceRecord } from './reference-api';
import { StockApi, TitleInput, TitleRecord } from './stock-api';

@Component({
  selector: 'app-titles-page',
  imports: [FormsModule, RouterLink, AcervoNav],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './titles-page.html',
})
export class TitlesPage {
  private readonly api = inject(StockApi);
  private readonly references = inject(ReferenceApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private detailRequest?: Subscription;
  private listRequest?: Subscription;
  readonly records = signal<TitleRecord[]>([]);
  readonly actors = signal<ReferenceRecord[]>([]);
  readonly directors = signal<ReferenceRecord[]>([]);
  readonly classes = signal<ReferenceRecord[]>([]);
  readonly selected = signal<TitleRecord | null>(null);
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
  readonly missingReferences = computed(() => !this.actors().length || !this.directors().length || !this.classes().length);
  filterName = '';
  filterCategory = '';
  filterActorId: number | null = null;
  formName = '';
  formYear: number | null = null;
  formCategory = '';
  formSynopsis = '';
  formDirectorId: number | null = null;
  formClassId: number | null = null;
  formActorIds: number[] = [];

  constructor() {
    this.loadList();
    this.loadOptions();
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.detailRequest?.unsubscribe();
      this.detailLoading.set(false);
      this.selected.set(null);
      this.detailError.set(''); this.actionError.set(''); this.fieldErrors.set({});
      this.resetForm();
      if (params.has('novo')) { this.mode.set('new'); return; }
      const id = Number(params.get('id'));
      if (Number.isSafeInteger(id) && id > 0) { this.mode.set('detail'); this.loadDetail(id); return; }
      this.mode.set('idle');
    });
  }

  loadList(): void {
    this.listRequest?.unsubscribe();
    this.loading.set(true); this.listError.set('');
    this.listRequest = this.api.listTitles({ name: this.filterName, category: this.filterCategory, actorId: this.filterActorId ?? undefined })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (records) => { this.records.set(records); this.loading.set(false); },
        error: (error: unknown) => { this.listError.set(apiErrorMessage(error)); this.loading.set(false); },
      });
  }

  loadOptions(): void {
    this.optionsLoading.set(true); this.optionsError.set('');
    forkJoin({ actors: this.references.list('atores'), directors: this.references.list('diretores'), classes: this.references.list('classes') })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (options) => { this.actors.set(options.actors); this.directors.set(options.directors); this.classes.set(options.classes); this.optionsLoading.set(false); },
        error: (error: unknown) => { this.optionsError.set(apiErrorMessage(error)); this.optionsLoading.set(false); },
      });
  }

  retryDetail(): void {
    this.loadDetail(Number(this.route.snapshot.queryParamMap.get('id')));
  }

  loadDetail(id: number): void {
    this.detailRequest?.unsubscribe();
    this.detailLoading.set(true); this.detailError.set('');
    this.detailRequest = this.api.getTitle(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (record) => {
        this.selected.set(record); this.formName = record.name; this.formYear = record.year;
        this.formCategory = record.category; this.formSynopsis = record.synopsis;
        this.formDirectorId = record.director.id; this.formClassId = record.rentalClass.id;
        this.formActorIds = record.actors.map((actor) => actor.id); this.detailLoading.set(false);
      },
      error: (error: unknown) => { this.detailError.set(apiErrorMessage(error)); this.detailLoading.set(false); },
    });
  }

  toggleActor(id: number, checked: boolean): void {
    this.formActorIds = checked ? [...this.formActorIds, id] : this.formActorIds.filter((actorId) => actorId !== id);
  }

  save(form: NgForm): void {
    if (this.busy() || this.optionsLoading() || this.optionsError() || this.missingReferences()) return;
    form.form.markAllAsTouched();
    if (form.invalid || !this.formActorIds.length || !this.formYear || !this.formDirectorId || !this.formClassId) return;
    const fields: Record<string, string> = {};
    if (!this.formName.trim()) fields['name'] = 'Informe o nome do título.';
    if (!this.formCategory.trim()) fields['category'] = 'Informe a categoria.';
    if (!this.formSynopsis.trim()) fields['synopsis'] = 'Informe a sinopse.';
    if (!Number.isInteger(this.formYear)) fields['year'] = 'Informe um ano inteiro.';
    this.fieldErrors.set(fields);
    if (Object.keys(fields).length) return;
    const input: TitleInput = { name: this.formName.trim(), year: this.formYear, category: this.formCategory.trim(),
      synopsis: this.formSynopsis.trim(), directorId: this.formDirectorId, classId: this.formClassId, actorIds: this.formActorIds };
    const current = this.selected();
    if (this.mode() === 'detail' && !current) return;
    this.saving.set(true); this.actionError.set(''); this.feedback.set('');
    const request = current ? this.api.updateTitle(current.id, input) : this.api.createTitle(input);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.saving.set(false); this.feedback.set('Título salvo com sucesso.'); this.loadList(); void this.router.navigate(['/acervo/titulos']); },
      error: (error: unknown) => { this.saving.set(false); this.captureError(error); },
    });
  }

  remove(dialog: HTMLDialogElement): void {
    const current = this.selected();
    if (!current || this.busy()) return;
    this.deleting.set(true); this.actionError.set(''); this.feedback.set('');
    this.api.deleteTitle(current.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.deleting.set(false); dialog.close(); this.feedback.set('Título excluído com sucesso.'); this.loadList(); void this.router.navigate(['/acervo/titulos']); },
      error: (error: unknown) => { this.deleting.set(false); dialog.close(); this.captureError(error); },
    });
  }

  private resetForm(): void {
    this.formName = ''; this.formYear = null; this.formCategory = ''; this.formSynopsis = '';
    this.formDirectorId = null; this.formClassId = null; this.formActorIds = [];
  }

  private captureError(error: unknown): void {
    this.fieldErrors.set(apiFieldErrors(error)); this.actionError.set(apiErrorMessage(error));
  }
}
