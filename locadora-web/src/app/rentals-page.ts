import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { rentals } from './demo-data';

@Component({
  selector: 'app-rentals-page', imports: [DatePipe, FormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-base-content/60">Área de atendimento</p><h1 class="mt-1 text-3xl font-bold">Locações</h1><p class="mt-2 text-base-content/65">Acompanhe retiradas, vencimentos e devoluções.</p></div><div class="flex flex-wrap gap-2"><a routerLink="/locacoes/devolucao" class="btn">Registrar devolução</a><a routerLink="/locacoes/nova" class="btn btn-primary">Nova locação</a></div></div>
    <div class="mb-5 grid gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:grid-cols-[1fr_220px]"><label class="block"><span class="mb-1 block text-sm font-medium">Buscar cliente, título ou série</span><input class="input w-full" type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Digite para filtrar" /></label><label class="block"><span class="mb-1 block text-sm font-medium">Situação</span><select class="select w-full" [ngModel]="status()" (ngModelChange)="status.set($event)"><option value="">Todas</option><option>Em andamento</option><option>Em atraso</option><option>Devolvida</option></select></label></div>
    <section class="rounded-box border border-base-300 bg-base-100" aria-label="Lista de locações">@if (filtered.length) { <div class="overflow-x-auto"><table class="table"><thead><tr><th>Cliente</th><th>Título / exemplar</th><th>Vencimento</th><th>Situação</th><th></th></tr></thead><tbody>@for (rental of filtered; track rental.id) { <tr><td class="font-medium">{{ rental.customer }}</td><td>{{ rental.title }}<div class="text-xs text-base-content/60">{{ rental.serial }}</div></td><td>{{ rental.due | date:'dd/MM/yyyy':'':'pt-BR' }}</td><td><span class="badge badge-sm" [class.badge-warning]="rental.status === 'Em atraso'" [class.badge-success]="rental.status === 'Devolvida'">{{ rental.status }}</span></td><td><a class="btn btn-sm btn-ghost" [routerLink]="['/locacoes', rental.id]">Ver detalhes</a></td></tr> }</tbody></table></div> } @else { <div role="status" class="p-10 text-center"><h2 class="font-semibold">Nenhuma locação encontrada</h2><p class="mt-1 text-sm text-base-content/65">Ajuste a busca ou o filtro de situação.</p></div> }</section>`,
})
export class RentalsPage {
  readonly query = signal(''); readonly status = signal('');
  get filtered() { const term = this.query().toLocaleLowerCase('pt-BR'); return rentals.filter((rental) => (!this.status() || rental.status === this.status()) && `${rental.customer} ${rental.title} ${rental.serial}`.toLocaleLowerCase('pt-BR').includes(term)); }
}
