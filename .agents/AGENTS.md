# Instruções para agentes

Este repositório contém uma API Spring Boot em `locadora-api/` e uma aplicação Angular em `locadora-web/`.

## Preferências do projeto

- Não escreva testes automatizados nem altere testes existentes, salvo pedido explícito do usuário. Para conferir alterações, prefira build, compilação e uma verificação manual breve do fluxo afetado.
- Mantenha as soluções simples e fáceis de entender. Use recursos comuns e estáveis dos frameworks. Evite padrões avançados, metaprogramação, abstrações genéricas, gerenciamento de estado complexo e configurações sofisticadas sem necessidade concreta.
- Siga a estrutura e as convenções existentes antes de criar novos arquivos, camadas ou dependências. Faça mudanças pequenas e diretamente ligadas ao pedido.
- Quando uma solução mais avançada for realmente necessária, explique o motivo e escolha a opção de menor complexidade que resolva o problema.

## Frontend (`locadora-web/`)

- Use sempre Tailwind CSS e daisyUI para estilizar interfaces. Antes de escrever HTML ou classes do daisyUI, siga `.agents/skills/daisyui/SKILL.md` e os guias relacionados de uso, cores e componentes.
- Para decisões visuais, siga `.agents/skills/frontend-design/SKILL.md` e `.agents/skills/frontend-ui-engineering/SKILL.md`. Preserve a identidade visual existente quando houver uma.
- Prefira componentes Angular pequenos, templates claros e serviços simples. Evite complexidade de RxJS, estado global ou recursos avançados do Angular quando a funcionalidade puder ser feita com recursos básicos.
- Mantenha a interface responsiva e utilizável por teclado, com estados claros de carregamento, vazio e erro quando forem relevantes.

## Backend (`locadora-api/`)

- Siga `.agents/skills/java-springboot/SKILL.md` no que for compatível com estas instruções, especialmente para organização, injeção por construtor e tratamento de dados.
- Prefira controllers, services e repositories diretos, com nomes descritivos e responsabilidades claras. Evite arquiteturas ou mecanismos avançados do Spring sem necessidade concreta.
- Valide entradas e não exponha dados sensíveis nem grave segredos no código.

## Ao concluir

- Resuma o que mudou e como verificou. Se alguma verificação não puder ser feita, diga o motivo.
