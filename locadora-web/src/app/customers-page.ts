import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { customers } from './demo-data';

@Component({
  selector: 'app-customers-page', imports: [FormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-base-content/60">Área de atendimento</p><h1 class="mt-1 text-3xl font-bold">Clientes</h1><p class="mt-2 text-base-content/65">Sócios e dependentes cadastrados na locadora.</p></div><a routerLink="/clientes/novo" class="btn btn-primary">Inscrever sócio</a></div>
    <div class="mb-5 grid gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:grid-cols-[1fr_auto] sm:items-end"><label class="block"><span class="mb-1 block text-sm font-medium">Buscar por nome ou inscrição</span><input class="input w-full" type="search" placeholder="Digite para filtrar" [ngModel]="query()" (ngModelChange)="query.set($event)" /></label><span class="pb-3 text-sm text-base-content/60">{{ filtered.length }} cliente(s)</span></div>
    <section class="rounded-box border border-base-300 bg-base-100" aria-label="Lista de clientes">
      @if (filtered.length) { <div class="overflow-x-auto"><table class="table"><thead><tr><th>Inscrição</th><th>Nome</th><th>Tipo</th><th>Situação</th><th></th></tr></thead><tbody>@for (customer of filtered; track customer.id) { <tr><td class="font-medium">{{ customer.registration }}</td><td>{{ customer.name }}</td><td>{{ customer.type }}</td><td><span class="badge badge-sm" [class.badge-success]="customer.status === 'Ativo'" [class.badge-ghost]="customer.status !== 'Ativo'">{{ customer.status }}</span></td><td><a class="btn btn-sm btn-ghost" [routerLink]="['/clientes', customer.id]">Ver detalhes</a></td></tr> }</tbody></table></div> }
      @else { <div role="status" class="p-10 text-center"><h2 class="font-semibold">Nenhum cliente encontrado</h2><p class="mt-1 text-sm text-base-content/65">Tente outro nome ou número de inscrição.</p></div> }
    </section>`,
})
export class CustomersPage {
  readonly query = signal('');
  get filtered() { const term = this.query().toLocaleLowerCase('pt-BR'); return customers.filter((customer) => `${customer.name} ${customer.registration}`.toLocaleLowerCase('pt-BR').includes(term)); }
}
