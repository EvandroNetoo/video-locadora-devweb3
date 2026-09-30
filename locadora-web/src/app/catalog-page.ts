import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { titles } from './demo-data';

@Component({
  selector: 'app-catalog-page', imports: [FormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mb-8 grid gap-6 rounded-box bg-neutral p-6 text-neutral-content md:grid-cols-[1.4fr_1fr] md:items-end md:p-10">
      <div><p class="mb-3 text-sm font-semibold text-accent">Catálogo Passatempo</p><h1 class="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Histórias para levar para casa.</h1><p class="mt-4 max-w-lg text-neutral-content/75">Explore o acervo por título, categoria ou ator e veja os exemplares disponíveis.</p></div>
      <div class="rounded-box border border-neutral-content/20 p-5"><p class="text-sm text-neutral-content/70">No acervo de demonstração</p><p class="mt-2 text-3xl font-bold">{{ titles.length }} títulos</p><p class="mt-1 text-sm text-neutral-content/70">Dados ilustrativos para visualizar a interface.</p></div>
    </section>
    <section aria-labelledby="buscar-titulos">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4"><div><h2 id="buscar-titulos" class="text-2xl font-bold">Encontre um filme</h2><p class="mt-1 text-sm text-base-content/65">Busque entre os registros de exemplo.</p></div><span class="text-sm text-base-content/60">{{ filtered.length }} resultado(s)</span></div>
      <div class="mb-7 grid gap-3 rounded-box border border-base-300 bg-base-100 p-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <label class="block"><span class="mb-1 block text-sm font-medium">Nome do título</span><input class="input w-full" type="search" placeholder="Ex.: Interestelar" [ngModel]="name()" (ngModelChange)="name.set($event)" /></label>
        <label class="block"><span class="mb-1 block text-sm font-medium">Categoria</span><select class="select w-full" [ngModel]="category()" (ngModelChange)="category.set($event)"><option value="">Todas</option>@for (option of categories; track option) { <option [value]="option">{{ option }}</option> }</select></label>
        <label class="block"><span class="mb-1 block text-sm font-medium">Ator ou atriz</span><input class="input w-full" type="search" placeholder="Nome no elenco" [ngModel]="actor()" (ngModelChange)="actor.set($event)" /></label>
      </div>
      @if (filtered.length) { <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">@for (title of filtered; track title.id) {
        <article class="card card-border overflow-hidden bg-base-100"><div class="poster aspect-[4/3]" [class]="title.poster"><span class="max-w-48 text-2xl font-bold leading-tight">{{ title.name }}</span></div><div class="card-body gap-2"><p class="text-sm text-base-content/60">{{ title.category }} · {{ title.year }}</p><h3 class="card-title text-lg">{{ title.name }}</h3><p class="text-sm">{{ title.available }} de {{ title.total }} exemplares disponíveis</p><div class="card-actions mt-3 items-center justify-between"><span class="badge" [class.badge-success]="title.available > 0" [class.badge-ghost]="title.available === 0">{{ title.available > 0 ? 'Disponível' : 'Indisponível' }}</span><a class="btn btn-sm btn-ghost" [routerLink]="['/catalogo', title.id]">Ver detalhes</a></div></div></article>
      }</div> } @else { <div role="status" class="rounded-box border border-dashed border-base-300 bg-base-100 p-10 text-center"><h3 class="text-lg font-semibold">Nenhum título encontrado</h3><p class="mt-1 text-sm text-base-content/65">Tente outro nome, categoria ou pessoa do elenco.</p></div> }
    </section>`,
})
export class CatalogPage {
  readonly titles = titles;
  readonly categories = [...new Set(titles.map((title) => title.category))];
  readonly name = signal(''); readonly category = signal(''); readonly actor = signal('');
  get filtered() {
    const name = this.name().toLocaleLowerCase('pt-BR'); const category = this.category(); const actor = this.actor().toLocaleLowerCase('pt-BR');
    return titles.filter((title) => title.name.toLocaleLowerCase('pt-BR').includes(name) && (!category || title.category === category) && title.actors.some((person) => person.toLocaleLowerCase('pt-BR').includes(actor)));
  }
}
