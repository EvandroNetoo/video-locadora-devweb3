import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { titles } from './demo-data';

@Component({
  selector: 'app-title-page', imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/catalogo" class="link link-hover text-sm">← Voltar ao catálogo</a>
    @if (title) {
      <div class="mt-6 grid gap-8 lg:grid-cols-[300px_1fr]">
        <div class="poster min-h-96 rounded-box" [class]="title.poster"><span class="max-w-60 text-4xl font-bold leading-tight">{{ title.name }}</span></div>
        <div><div class="mb-3 flex flex-wrap gap-2"><span class="badge badge-outline">{{ title.category }}</span><span class="badge badge-outline">{{ title.year }}</span><span class="badge badge-outline">{{ title.className }}</span></div>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ title.name }}</h1><p class="mt-4 max-w-2xl text-base-content/75">{{ title.synopsis }}</p>
          <dl class="mt-7 grid gap-4 border-y border-base-300 py-6 sm:grid-cols-2">
            <div><dt class="text-sm text-base-content/60">Direção</dt><dd class="mt-1 font-medium">{{ title.director }}</dd></div>
            <div><dt class="text-sm text-base-content/60">Elenco</dt><dd class="mt-1 font-medium">{{ title.actors.join(', ') }}</dd></div>
            <div><dt class="text-sm text-base-content/60">Valor da classe</dt><dd class="mt-1 font-medium">{{ title.price }}</dd></div>
            <div><dt class="text-sm text-base-content/60">Exemplares disponíveis</dt><dd class="mt-1 font-medium">{{ title.available }} de {{ title.total }}</dd></div>
          </dl><div class="alert mt-6" [class.alert-success]="title.available > 0" [class.alert-warning]="title.available === 0" role="status">{{ title.available > 0 ? 'Há exemplares disponíveis para locação no balcão.' : 'Todos os exemplares estão locados no momento.' }}</div>
        </div>
      </div>
    } @else { <div class="alert alert-warning mt-6" role="status">Título de demonstração não encontrado.</div> }`,
})
export class TitlePage {
  private readonly route = inject(ActivatedRoute);
  readonly title = titles.find((title) => title.id === Number(this.route.snapshot.paramMap.get('id')));
}
