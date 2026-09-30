export interface Title {
  id: number;
  name: string;
  year: number;
  category: string;
  director: string;
  actors: string[];
  synopsis: string;
  className: string;
  price: string;
  available: number;
  total: number;
  poster: string;
}

export const titles: Title[] = [
  { id: 1, name: 'A Viagem de Chihiro', year: 2001, category: 'Animação', director: 'Hayao Miyazaki', actors: ['Rumi Hiiragi', 'Miyu Irino'], synopsis: 'Chihiro entra em um mundo fantástico e precisa encontrar o caminho de volta para casa.', className: 'Clássico', price: 'R$ 8,00', available: 2, total: 3, poster: 'poster-teal' },
  { id: 2, name: 'Central do Brasil', year: 1998, category: 'Drama', director: 'Walter Salles', actors: ['Fernanda Montenegro', 'Vinícius de Oliveira'], synopsis: 'Uma ex-professora e um menino atravessam o Brasil em busca da família dele.', className: 'Clássico', price: 'R$ 8,00', available: 1, total: 2, poster: 'poster-orange' },
  { id: 3, name: 'O Auto da Compadecida', year: 2000, category: 'Comédia', director: 'Guel Arraes', actors: ['Matheus Nachtergaele', 'Selton Mello'], synopsis: 'As aventuras de João Grilo e Chicó misturam humor e tradição popular.', className: 'Popular', price: 'R$ 10,00', available: 0, total: 2, poster: 'poster-blue' },
  { id: 4, name: 'Interestelar', year: 2014, category: 'Ficção científica', director: 'Christopher Nolan', actors: ['Matthew McConaughey', 'Anne Hathaway'], synopsis: 'Uma equipe viaja além da Terra para procurar um novo lar para a humanidade.', className: 'Lançamento', price: 'R$ 15,00', available: 3, total: 4, poster: 'poster-navy' },
];

export const actors = [
  { id: 1, name: 'Rumi Hiiragi', extra: '1 título vinculado' },
  { id: 2, name: 'Miyu Irino', extra: '1 título vinculado' },
  { id: 3, name: 'Fernanda Montenegro', extra: '1 título vinculado' },
  { id: 4, name: 'Vinícius de Oliveira', extra: '1 título vinculado' },
  { id: 5, name: 'Matheus Nachtergaele', extra: '1 título vinculado' },
  { id: 6, name: 'Selton Mello', extra: '1 título vinculado' },
  { id: 7, name: 'Matthew McConaughey', extra: '1 título vinculado' },
  { id: 8, name: 'Anne Hathaway', extra: '1 título vinculado' },
];
export const directors = [
  { id: 1, name: 'Hayao Miyazaki', extra: '1 título vinculado' },
  { id: 2, name: 'Walter Salles', extra: '1 título vinculado' },
  { id: 3, name: 'Guel Arraes', extra: '1 título vinculado' },
  { id: 4, name: 'Christopher Nolan', extra: '1 título vinculado' },
];
export const classes = [
  { id: 1, name: 'Clássico', extra: 'R$ 8,00 · 5 dias' },
  { id: 2, name: 'Popular', extra: 'R$ 10,00 · 4 dias' },
  { id: 3, name: 'Lançamento', extra: 'R$ 15,00 · 2 dias' },
];
export const items = [
  { id: 1, name: 'DVD-00128', extra: 'A Viagem de Chihiro · DVD', status: 'Disponível' },
  { id: 2, name: 'BLU-00451', extra: 'Interestelar · Blu-ray', status: 'Disponível' },
  { id: 3, name: 'DVD-00087', extra: 'O Auto da Compadecida · DVD', status: 'Locado' },
];
export const customers = [
  { id: 1, registration: '000142', name: 'Marina Costa', type: 'Sócia', status: 'Ativo', dependents: 2 },
  { id: 2, registration: '000143', name: 'Pedro Costa', type: 'Dependente', status: 'Ativo', dependents: 0, holder: 'Marina Costa' },
  { id: 3, registration: '000144', name: 'Lúcia Almeida', type: 'Sócia', status: 'Ativo', dependents: 0 },
  { id: 4, registration: '000145', name: 'Rafael Nunes', type: 'Sócio', status: 'Inativo', dependents: 0 },
];
export const rentals = [
  { id: 1, customer: 'Marina Costa', title: 'A Viagem de Chihiro', serial: 'DVD-00129', date: '2026-09-28', due: '2026-10-03', price: 'R$ 8,00', status: 'Em andamento' },
  { id: 2, customer: 'Lúcia Almeida', title: 'O Auto da Compadecida', serial: 'DVD-00087', date: '2026-09-20', due: '2026-09-24', price: 'R$ 10,00', status: 'Em atraso' },
  { id: 3, customer: 'Pedro Costa', title: 'Interestelar', serial: 'BLU-00450', date: '2026-09-14', due: '2026-09-16', price: 'R$ 15,00', status: 'Devolvida' },
];
