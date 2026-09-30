import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError, ReferenceApi, ReferenceInput, ReferenceKind, ReferenceRecord } from './reference-api';

const labels: Record<ReferenceKind, string> = { atores: 'Atores', diretores: 'Diretores', classes: 'Classes' };
const singular: Record<ReferenceKind, string> = { atores: 'ator', diretores: 'diretor', classes: 'classe' };

@Component({
  selector: 'app-reference-page',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6"><p class="text-sm text-base-content/60">Área de atendimento / Acervo</p><h1 class="mt-1 text-3xl font-bold">{{ label }}</h1><p class="mt-2 text-base-content/65">Consulte e mantenha os cadastros de {{ label.toLocaleLowerCase('pt-BR') }}.</p></div>
    <nav class="mb-6 flex gap-2 overflow-x-auto border-b border-base-300 pb-3" aria-label="Seções do acervo">
      @for (link of links; track link.key) { <a class="btn btn-sm whitespace-nowrap" [class.btn-primary]="kind === link.key" [class.btn-ghost]="kind !== link.key" [routerLink]="['/acervo', link.key]">{{ link.label }}</a> }
    </nav>
    @if (feedback()) { <div class="alert alert-success mb-5" role="status">{{ feedback() }}</div> }
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
      <section class="rounded-box border border-base-300 bg-base-100" aria-labelledby="records-title">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-5"><div><h2 id="records-title" class="text-xl font-bold">Registros</h2><p class="text-sm text-base-content/60">{{ records().length }} {{ records().length === 1 ? 'registro' : 'registros' }}</p></div><a class="btn btn-primary btn-sm" [routerLink]="['/acervo', kind]" [queryParams]="{ novo: 1 }">Novo cadastro</a></div>
        @if (loading()) { <div class="space-y-3 p-5" aria-busy="true" aria-label="Carregando registros"><div class="skeleton h-10 w-full"></div><div class="skeleton h-10 w-full"></div><div class="skeleton h-10 w-full"></div></div> }
        @else if (listError()) { <div class="p-5"><div class="alert alert-error" role="alert">{{ listError() }}</div><button class="btn btn-sm mt-4" (click)="loadList()">Tentar novamente</button></div> }
        @else if (records().length === 0) { <div role="status" class="p-10 text-center"><h3 class="font-semibold">Nenhum cadastro ainda</h3><p class="mt-1 text-sm text-base-content/65">Use “Novo cadastro” para adicionar o primeiro registro.</p></div> }
        @else { <div class="overflow-x-auto"><table class="table"><thead><tr><th>Nome</th>@if (kind === 'classes') { <th>Valor</th><th>Prazo</th> }<th></th></tr></thead><tbody>@for (record of records(); track record.id) { <tr><td class="font-medium">{{ record.name }}</td>@if (kind === 'classes') { <td>{{ record.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td><td>{{ record.days }} dias</td> }<td><a class="btn btn-ghost btn-sm" [routerLink]="['/acervo', kind]" [queryParams]="{ id: record.id }">Detalhes</a></td></tr> }</tbody></table></div> }
      </section>
      <aside class="rounded-box border border-base-300 bg-base-100 p-5" aria-label="Detalhe ou formulário de cadastro">
        @if (mode() === 'idle') { <div class="py-10 text-center"><div class="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-base-200 text-xl" aria-hidden="true">▣</div><h2 class="text-lg font-bold">Selecione um registro</h2><p class="mt-2 text-sm text-base-content/65">Veja os detalhes ou inicie um novo cadastro.</p></div> }
        @else {
          <div class="mb-5 flex items-start justify-between gap-2"><div><p class="text-sm text-base-content/60">{{ mode() === 'new' ? 'Novo cadastro' : 'Editar cadastro' }}</p><h2 class="text-xl font-bold">{{ mode() === 'new' ? 'Cadastrar ' + noun : selected()?.name || label }}</h2></div><a class="btn btn-ghost btn-sm" [routerLink]="['/acervo', kind]" aria-label="Fechar formulário">✕</a></div>
          @if (detailLoading()) { <div class="space-y-3" aria-busy="true"><div class="skeleton h-12 w-full"></div><div class="skeleton h-12 w-full"></div></div> }
          @else if (detailError()) { <div class="alert alert-error" role="alert">{{ detailError() }}</div> }
          @else {
            <form #form="ngForm" class="space-y-4" (ngSubmit)="save(form)">
              <label class="block"><span class="mb-1 block text-sm font-medium">Nome <span aria-hidden="true">*</span></span><input class="input w-full" name="name" [(ngModel)]="formName" #nameInput="ngModel" required maxlength="120" autocomplete="off" [attr.aria-invalid]="nameInput.invalid && nameInput.touched || fieldErrors()['name'] ? true : null" [attr.aria-describedby]="nameInput.invalid && nameInput.touched || fieldErrors()['name'] ? 'name-error' : null" />@if (nameInput.invalid && nameInput.touched || fieldErrors()['name']) { <span id="name-error" class="mt-1 block text-sm text-error">{{ fieldErrors()['name'] || 'Informe o nome.' }}</span> }</label>
              @if (kind === 'classes') {
                <label class="block"><span class="mb-1 block text-sm font-medium">Valor da locação (R$) <span aria-hidden="true">*</span></span><input class="input w-full" type="number" name="price" [(ngModel)]="formPrice" #priceInput="ngModel" required min="0.01" step="0.01" [attr.aria-invalid]="priceInput.invalid && priceInput.touched || fieldErrors()['price'] ? true : null" [attr.aria-describedby]="priceInput.invalid && priceInput.touched || fieldErrors()['price'] ? 'price-error' : null" />@if (priceInput.invalid && priceInput.touched || fieldErrors()['price']) { <span id="price-error" class="mt-1 block text-sm text-error">{{ fieldErrors()['price'] || 'Informe um valor maior que zero.' }}</span> }</label>
                <label class="block"><span class="mb-1 block text-sm font-medium">Prazo em dias <span aria-hidden="true">*</span></span><input class="input w-full" type="number" name="days" [(ngModel)]="formDays" #daysInput="ngModel" required min="1" max="3650" step="1" [attr.aria-invalid]="daysInput.invalid && daysInput.touched || fieldErrors()['days'] ? true : null" [attr.aria-describedby]="daysInput.invalid && daysInput.touched || fieldErrors()['days'] ? 'days-error' : null" />@if (daysInput.invalid && daysInput.touched || fieldErrors()['days']) { <span id="days-error" class="mt-1 block text-sm text-error">{{ fieldErrors()['days'] || 'Informe um prazo entre 1 e 3650 dias.' }}</span> }</label>
              }
              @if (actionError()) { <div class="alert alert-error text-sm" role="alert">{{ actionError() }}</div> }
              <div class="flex flex-wrap gap-2"><button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving()">{{ saving() ? 'Salvando...' : mode() === 'new' ? 'Cadastrar' : 'Salvar alterações' }}</button>@if (mode() === 'detail') { <button class="btn btn-error btn-outline" type="button" (click)="confirmDialog.showModal()">Excluir</button> }</div>
            </form>
            <dialog #confirmDialog class="modal"><div class="modal-box"><h3 class="text-lg font-bold">Excluir {{ noun }}?</h3><p class="mt-3 text-sm">Esta ação não pode ser desfeita. Se houver títulos vinculados, a API recusará a exclusão.</p><div class="modal-action"><form method="dialog"><button class="btn">Voltar</button></form><button class="btn btn-error" type="button" [disabled]="deleting()" (click)="remove(confirmDialog)">{{ deleting() ? 'Excluindo...' : 'Confirmar exclusão' }}</button></div></div><form method="dialog" class="modal-backdrop"><button>Fechar</button></form></dialog>
          }
        }
      </aside>
    </div>`,
})
export class ReferencePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ReferenceApi);
  readonly kind = this.route.snapshot.data['kind'] as ReferenceKind;
  readonly label = labels[this.kind];
  readonly noun = singular[this.kind];
  readonly links = [
    { key: 'atores', label: 'Atores' }, { key: 'diretores', label: 'Diretores' },
    { key: 'classes', label: 'Classes' }, { key: 'titulos', label: 'Títulos' }, { key: 'itens', label: 'Itens físicos' },
  ];
  readonly records = signal<ReferenceRecord[]>([]);
  readonly selected = signal<ReferenceRecord | null>(null);
  readonly mode = signal<'idle' | 'new' | 'detail'>('idle');
  readonly loading = signal(true);
  readonly detailLoading = signal(false);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly listError = signal('');
  readonly detailError = signal('');
  readonly actionError = signal('');
  readonly feedback = signal('');
  readonly fieldErrors = signal<Record<string, string>>({});
  formName = '';
  formPrice: number | null = null;
  formDays: number | null = null;

  constructor() {
    this.loadList();
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.actionError.set(''); this.detailError.set(''); this.fieldErrors.set({});
      if (params.has('novo')) { this.mode.set('new'); this.selected.set(null); this.resetForm(); return; }
      const id = Number(params.get('id'));
      if (id > 0) { this.mode.set('detail'); this.loadDetail(id); return; }
      this.mode.set('idle'); this.selected.set(null); this.resetForm();
    });
  }

  loadList(): void {
    this.loading.set(true); this.listError.set('');
    this.api.list(this.kind).subscribe({
      next: (records) => { this.records.set(records); this.loading.set(false); },
      error: (error: unknown) => { this.listError.set(this.message(error)); this.loading.set(false); },
    });
  }

  private loadDetail(id: number): void {
    this.detailLoading.set(true);
    this.api.get(this.kind, id).subscribe({
      next: (record) => { this.selected.set(record); this.formName = record.name; this.formPrice = record.price ?? null; this.formDays = record.days ?? null; this.detailLoading.set(false); },
      error: (error: unknown) => { this.selected.set(null); this.detailError.set(this.message(error)); this.detailLoading.set(false); },
    });
  }

  save(form: NgForm): void {
    if (form.invalid || this.saving()) return;
    const name = this.formName.trim();
    if (!name) { this.fieldErrors.set({ name: 'Informe o nome.' }); return; }
    const input: ReferenceInput = this.kind === 'classes'
      ? { name, price: this.formPrice ?? undefined, days: this.formDays ?? undefined }
      : { name };
    const current = this.selected();
    this.saving.set(true); this.actionError.set(''); this.fieldErrors.set({});
    const request = this.mode() === 'detail' && current ? this.api.update(this.kind, current.id, input) : this.api.create(this.kind, input);
    request.subscribe({
      next: () => { this.saving.set(false); this.feedback.set(`Cadastro de ${this.noun} salvo com sucesso.`); this.loadList(); this.router.navigate(['/acervo', this.kind]); },
      error: (error: unknown) => { this.saving.set(false); this.captureError(error); },
    });
  }

  remove(dialog: HTMLDialogElement): void {
    const current = this.selected();
    if (!current || this.deleting()) return;
    this.deleting.set(true); this.actionError.set('');
    this.api.delete(this.kind, current.id).subscribe({
      next: () => { this.deleting.set(false); dialog.close(); this.feedback.set(`Cadastro de ${this.noun} excluído com sucesso.`); this.loadList(); this.router.navigate(['/acervo', this.kind]); },
      error: (error: unknown) => { this.deleting.set(false); dialog.close(); this.captureError(error); },
    });
  }

  private resetForm(): void { this.formName = ''; this.formPrice = null; this.formDays = null; }
  private captureError(error: unknown): void {
    if (error instanceof HttpErrorResponse) this.fieldErrors.set((error.error as ApiError)?.fields || {});
    this.actionError.set(this.message(error));
  }
  private message(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Não foi possível conectar à API. Verifique se o servidor está em execução.';
      return (error.error as ApiError)?.message || 'Não foi possível concluir a operação.';
    }
    return 'Não foi possível concluir a operação.';
  }
}
