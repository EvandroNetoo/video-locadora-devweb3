import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-acervo-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="mb-6 flex gap-2 overflow-x-auto border-b border-base-300 pb-3" aria-label="Seções do acervo">
      @for (link of links; track link.key) {
        <a class="btn btn-ghost btn-sm whitespace-nowrap" [routerLink]="['/acervo', link.key]"
          routerLinkActive="btn-active" ariaCurrentWhenActive="page">{{ link.label }}</a>
      }
    </nav>`,
})
export class AcervoNav {
  readonly links = [
    { key: 'atores', label: 'Atores' }, { key: 'diretores', label: 'Diretores' },
    { key: 'classes', label: 'Classes' }, { key: 'titulos', label: 'Títulos' }, { key: 'itens', label: 'Itens físicos' },
  ];
}
