# Especificação da aplicação web

Esta especificação detalha a interface descrita em [../spec.md](../spec.md). O código atual contém o esqueleto Angular 21, sem rotas ou telas de negócio. A interface prevista consome a API em `locadora-api/`; não calcula nem decide regras de negócio por conta própria.

## Público e navegação

| Área | Pessoa | Telas e ações |
| --- | --- | --- |
| Catálogo | Cliente e funcionário | Busca por nome/nome original, categoria ou ator; lista de resultados; detalhe do título com elenco, direção, ano, sinopse, categoria, classe, valor e disponibilidade. |
| Acervo | Funcionário | Listas e formulários para atores, diretores, classes, títulos e itens; consulta de detalhes; edição e exclusão com confirmação. |
| Clientes | Funcionário | Lista e detalhe de sócios/dependentes; inscrição de sócio; inclusão de dependente; edição, ativação, desativação e exclusão. |
| Locações | Funcionário | Lista e detalhe; nova locação; alteração; cancelamento; devolução por número de série. |

A fonte distingue papéis, mas não especifica login. A navegação pode separar a consulta pública das ações de funcionário; proteção de acesso depende da definição de autenticação e permissões na API.

## Fluxos e comportamento

### Catálogo e acervo

- Exibir resultados de busca com nome, categoria e disponibilidade. No detalhe, mostrar a quantidade de itens disponíveis e os metadados existentes na API; não criar valores fictícios para nome original, nacionalidades ou distribuidor ausentes.
- Em cada formulário, mostrar campos obrigatórios e mensagens de validação próximas ao campo. Atores, diretores e classe de um título são escolhidos a partir dos cadastros existentes.
- Para item, solicitar número de série, título, data de aquisição e tipo. Uma exclusão pede confirmação e mostra o motivo retornado pela API se houver vínculo impeditivo.

### Clientes

- Ao inscrever sócio, pedir os dados do sócio e apresentar o número de inscrição gerado. Permitir adicionar dependentes a partir do detalhe do sócio.
- Mostrar situação ativa/inativa e quantidade de dependentes ativos. Bloquear na interface a inclusão do quarto dependente ativo; exibir eventual conflito retornado pelo servidor.
- Na desativação de sócio, informar que os dependentes também serão desativados. Na reativação, apresentar quais dependentes serão reativados quando essa escolha for definida no contrato da API.
- Pedir confirmação antes de excluir e informar quando cliente ou algum dependente possui locações.

### Locação e devolução

- Na nova locação, selecionar cliente e item; mostrar disponibilidade. Após a seleção, apresentar valor e vencimento sugeridos pela API e permitir ajuste pelo funcionário.
- Se o cliente estiver em atraso, mostrar as locações apontadas pela API e impedir a confirmação. Se não houver item disponível, mostrar a indisponibilidade; exibir data provável apenas quando a API fornecer cálculo definido.
- No detalhe da locação, mostrar item, cliente, datas, valor, multa e estado de pagamento disponível. Cancelamento exige confirmação e explica o bloqueio para locação paga.
- Na devolução, aceitar número de série, mostrar a locação vigente encontrada, atraso, multa e total devido antes de confirmar. Após confirmação, mostrar a data efetiva registrada. Quando a fórmula da multa e a quitação forem definidas, refletir esses valores vindos da API.

## Apresentação e acessibilidade

- Usar Tailwind CSS e daisyUI conforme as instruções locais do projeto. Manter componentes pequenos, navegação clara e visual responsivo para desktop e celular.
- Todos os formulários e confirmações devem funcionar por teclado, com rótulos visíveis, foco perceptível e erros anunciados de modo compreensível.
- Cada lista ou detalhe consultado na API apresenta estados de carregamento, vazio e falha. Uma ação de gravação mostra progresso e resultado, evitando envio duplicado.
- Datas e moeda devem ser exibidas em formato brasileiro; os valores enviados e recebidos seguem o contrato da API.

## Condições para considerar a interface pronta

- Um cliente encontra títulos por nome, categoria e ator e consegue ver a disponibilidade correta.
- Um funcionário completa os cadastros, a locação e a devolução com mensagens claras para os bloqueios descritos no [spec geral](../spec.md).
- O frontend não supõe reservas, cálculo de multa, registro de pagamentos ou autenticação antes de seus contratos serem definidos.
- As telas funcionam em larguras de celular e desktop, por teclado, com estados de carregamento, vazio e erro nos fluxos relevantes.
