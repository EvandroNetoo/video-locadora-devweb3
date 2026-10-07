import { Routes } from '@angular/router';
import { CatalogPage } from './catalog-page';
import { TitlePage } from './title-page';
import { TitlesPage } from './titles-page';
import { ItemsPage } from './items-page';
import { ReferencePage } from './reference-page';
import { CustomersPage } from './customers-page';
import { CustomerPage } from './customer-page';
import { RentalsPage } from './rentals-page';
import { RentalPage } from './rental-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: 'catalogo', component: CatalogPage },
  { path: 'catalogo/:id', component: TitlePage },
  { path: 'acervo/atores', component: ReferencePage, data: { kind: 'atores' } },
  { path: 'acervo/diretores', component: ReferencePage, data: { kind: 'diretores' } },
  { path: 'acervo/classes', component: ReferencePage, data: { kind: 'classes' } },
  { path: 'acervo/titulos', component: TitlesPage },
  { path: 'acervo/itens', component: ItemsPage },
  { path: 'acervo', pathMatch: 'full', redirectTo: 'acervo/titulos' },
  { path: 'clientes', component: CustomersPage },
  { path: 'clientes/novo', component: CustomerPage },
  { path: 'clientes/:id', component: CustomerPage },
  { path: 'locacoes', component: RentalsPage },
  { path: 'locacoes/nova', component: RentalPage },
  { path: 'locacoes/devolucao', component: RentalPage },
  { path: 'locacoes/:id', component: RentalPage },
  { path: '**', redirectTo: 'catalogo' },
];
