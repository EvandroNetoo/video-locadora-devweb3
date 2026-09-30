import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { actors, classes, directors, items, titles } from './demo-data';

type Field = { key: string; label: string; type?: 'text' | 'date' | 'number' | 'textarea' | 'select'; options?: string[] };
type Entry = { id: number; name: string; extra: string; status?: string };
const fields: Record<string, Field[]> = {
  atores: [{ key: 'name', label: 'Nome completo' }],
  diretores: [{ key: 'name', label: 'Nome completo' }],
  classes: [{ key: 'name', label: 'Nome da classe' }, { key: 'price', label: 'Valor da locação (R$)', type: 'number' }, { key: 'days', label: 'Prazo em dias', type: 'number' }],
  titulos: [{ key: 'name', label: 'Nome do título' }, { key: 'year', label: 'Ano', type: 'number' }, { key: 'category', label: 'Categoria', type: 'select', options: ['Animação', 'Drama', 'Comédia', 'Ficção científica', 'Aventura', 'Suspense'] }, { key: 'director', label: 'Diretor', type: 'select', options: directors.map((item) => item.name) }, { key: 'actors', label: 'Atores', type: 'select', options: actors.map((item) => item.name) }, { key: 'className', label: 'Classe', type: 'select', options: classes.map((item) => item.name) }, { key: 'synopsis', label: 'Sinopse', type: 'textarea' }],
  itens: [{ key: 'name', label: 'Número de série' }, { key: 'title', label: 'Título', type: 'select', options: titles.map((item) => item.name) }, { key: 'acquired', label: 'Data de aquisição', type: 'date' }, { key: 'kind', label: 'Tipo', type: 'select', options: ['Fita', 'DVD', 'Blu-ray'] }],
};
const labels: Record<string, string> = { atores: 'Atores', diretores: 'Diretores', classes: 'Classes', titulos: 'Títulos', itens: 'Itens físicos' };
const entries: Record<string, Entry[]> = {
  atores: actors, diretores: directors, classes,
  titulos: titles.map((title) => ({ id: title.id, name: title.name, extra: `${title.category} · ${title.year}`, status: `${title.available} disponíveis` })),
  itens: items,
};

@Component({
  selector: 'app-section-page', imports: [FormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6"><p class="text-sm text-base-content/60">Área de atendimento / Acervo</p><h1 class="mt-1 text-3xl font-bold">{{ label() }}</h1><p class="mt-2 text-base-content/65">Consulta e cadastro de {{ label().toLocaleLowerCase('pt-BR') }}.</p></div>
    <nav class="mb-6 flex gap-2 overflow-x-auto border-b border-base-300 pb-3" aria-label="Seções do acervo">
      @for (link of links; track link.key) { <a class="btn btn-sm whitespace-nowrap" [class.btn-primary]="section() === link.key" [class.btn-ghost]="section() !== link.key" [routerLink]="['/acervo', link.key]">{{ link.label }}</a> }
    </nav>
    @if (valid()) {
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
        <section class="rounded-box border border-base-300 bg-base-100" aria-labelledby="records-title">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 p-5"><div><h2 id="records-title" class="text-xl font-bold">Registros</h2><p class="text-sm text-base-content/60">{{ currentEntries().length }} exemplos</p></div><a class="btn btn-primary btn-sm" [routerLink]="['/acervo', section()]" [queryParams]="{ novo: 1 }">Novo cadastro</a></div>
          <div class="overflow-x-auto"><table class="table"><thead><tr><th>Nome / identificação</th><th>Informações</th><th></th></tr></thead><tbody>
            @for (entry of currentEntries(); track entry.id) { <tr><td class="font-medium">{{ entry.name }}</td><td><span class="text-sm text-base-content/65">{{ entry.extra }}</span>@if (entry.status) { <span class="badge badge-outline badge-sm ml-2">{{ entry.status }}</span> }</td><td><a class="btn btn-ghost btn-sm" [routerLink]="['/acervo', section()]" [queryParams]="{ id: entry.id }">Detalhes</a></td></tr> }
          </tbody></table></div>
        </section>
        <aside class="rounded-box border border-base-300 bg-base-100 p-5" aria-label="Detalhe ou formulário de cadastro">
          @if (mode() === 'idle') { <div class="py-10 text-center"><div class="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-base-200 text-xl" aria-hidden="true">▣</div><h2 class="text-lg font-bold">Selecione um registro</h2><p class="mt-2 text-sm text-base-content/65">Veja os detalhes ou inicie um novo cadastro.</p></div> }
          @else {
            <div class="mb-5 flex items-start justify-between gap-2"><div><p class="text-sm text-base-content/60">{{ mode() === 'new' ? 'Novo registro' : 'Registro de exemplo' }}</p><h2 class="text-xl font-bold">{{ mode() === 'new' ? 'Cadastrar' : selected()?.name }}</h2></div><a class="btn btn-ghost btn-sm" [routerLink]="['/acervo', section()]" aria-label="Fechar formulário">✕</a></div>
            <form class="space-y-4" (submit)="$event.preventDefault()">
              @for (field of currentFields(); track field.key) { <label class="block"><span class="mb-1 block text-sm font-medium">{{ field.label }} <span aria-hidden="true">*</span></span>
                @switch (field.type) {
                  @case ('textarea') { <textarea class="textarea w-full" rows="4" [name]="field.key" [ngModel]="fieldValue(field.key)" required></textarea> }
                  @case ('select') { @if (field.key === 'actors') { <select class="select h-32 w-full" [name]="field.key" multiple aria-describedby="actors-help">@for (option of field.options; track option) { <option [value]="option">{{ option }}</option> }</select><span id="actors-help" class="mt-1 block text-xs text-base-content/60">Use Ctrl ou Command para selecionar mais de um.</span> } @else { <select class="select w-full" [name]="field.key" [ngModel]="fieldValue(field.key)" required><option value="">Selecione</option>@for (option of field.options; track option) { <option [value]="option">{{ option }}</option> }</select> } }
                  @default { <input class="input w-full" [type]="field.type || 'text'" [name]="field.key" [ngModel]="fieldValue(field.key)" required /> }
                }
              </label> }
              <div class="alert alert-info text-sm">Formulário de demonstração. As alterações serão habilitadas quando a API estiver conectada.</div>
              <div class="flex flex-wrap gap-2"><button class="btn btn-primary" type="button" disabled>Salvar registro</button>@if (mode() === 'detail') { <button class="btn btn-error btn-outline" type="button" (click)="confirmDialog.showModal()">Excluir</button> }</div>
            </form>
            <dialog #confirmDialog class="modal"><div class="modal-box"><h3 class="text-lg font-bold">Excluir registro?</h3><p class="mt-3 text-sm">A exclusão depende da verificação de vínculos pela API. Registros relacionados a títulos ou locações podem ser bloqueados.</p><div class="modal-action"><form method="dialog"><button class="btn">Voltar</button></form><button class="btn btn-error" disabled>Confirmar exclusão</button></div></div><form method="dialog" class="modal-backdrop"><button>Fechar</button></form></dialog>
          }
        </aside>
      </div>
    } @else { <div class="alert alert-warning">Seção não encontrada. <a routerLink="/acervo/titulos" class="link">Abrir títulos</a></div> }
  `,
})
export class SectionPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  private readonly query = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly links = Object.entries(labels).map(([key, label]) => ({ key, label }));
  readonly section = computed(() => this.params().get('section') || 'titulos');
  readonly valid = computed(() => Boolean(fields[this.section()]));
  readonly label = computed(() => labels[this.section()] || 'Acervo');
  readonly currentFields = computed(() => fields[this.section()] || []);
  readonly currentEntries = computed(() => entries[this.section()] || []);
  readonly mode = computed(() => this.query().has('novo') ? 'new' : this.query().has('id') ? 'detail' : 'idle');
  readonly selected = computed(() => this.currentEntries().find((entry) => entry.id === Number(this.query().get('id'))));
  fieldValue(key: string): string | number {
    if (this.mode() !== 'detail') return '';
    const entry = this.selected();
    if (!entry) return '';
    if (key === 'name') return entry.name;
    if (this.section() === 'titulos') {
      const title = titles.find((item) => item.id === entry.id);
      if (!title) return '';
      if (key === 'actors') return title.actors[0];
      return String(title[key as keyof typeof title] ?? '');
    }
    return '';
  }
}
