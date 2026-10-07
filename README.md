# Locadora

Monorepo com duas aplicações:

- `locadora-api/`: API Spring Boot (Java 21, Maven).
- `locadora-web/`: aplicação Angular.

## Desenvolvimento

Execute cada aplicação em um terminal:

```bash
cd locadora-api && ./mvnw spring-boot:run
```

```bash
cd locadora-web && npm install && npm start
```

## Verificação

Para compilar a API sem executar testes:

```bash
cd locadora-api && ./mvnw -DskipTests package
```

## API e Swagger

Com a API em execução, abra [Swagger UI](http://localhost:8080/swagger-ui.html).
O contrato OpenAPI em JSON está em [API docs](http://localhost:8080/v3/api-docs).
Todos os endpoints de atores, diretores, classes, títulos e itens estão documentados e podem ser chamados pelo Swagger.

Os recursos `/api/titulos` e `/api/itens` oferecem `GET` (lista), `POST` (cadastro),
`GET /{id}`, `PUT /{id}` e `DELETE /{id}`. Cadastro retorna `201` com `Location`,
alteração retorna `200` e exclusão retorna `204`.

Exemplo de título (cadastre os atores, o diretor e a classe antes e use seus identificadores):

```json
{
  "name": "Interestelar",
  "year": 2014,
  "synopsis": "Uma equipe de exploradores viaja pelo espaço.",
  "category": "Ficção científica",
  "directorId": 1,
  "classId": 1,
  "actorIds": [1, 2]
}
```

Exemplo de item físico:

```json
{
  "serialNumber": "DVD-0001",
  "titleId": 1,
  "acquisitionDate": "2026-10-07",
  "type": "DVD"
}
```

- Títulos: filtros opcionais `name` (trecho), `category` (valor exato) e `actorId`.
- Itens: filtros opcionais `titleId`, `type` e `serialNumber` (valor exato).
- Tipos de item: `FITA`, `DVD` e `BLU_RAY`; datas no formato `AAAA-MM-DD`.
- Números de série são únicos e têm espaços nas extremidades removidos.
- Títulos exigem pelo menos um ator, diretor e classe existentes. Atores, diretores e classes vinculados não podem ser excluídos, nem títulos com itens.
- Dados inválidos retornam `400`, registros/referências inexistentes `404` e conflitos `409`.
  Erros incluem `message`; erros de validação também incluem `fields`.

O módulo de locações ainda não existe; a regra de bloquear exclusão de item com histórico
de locações deverá ser aplicada quando esse vínculo for implementado.

O frontend integra os CRUDs de títulos e itens em `/acervo/titulos` e `/acervo/itens`,
com filtros, seleção dos cadastros relacionados, edição e exclusão com confirmação.
O catálogo e os detalhes dos títulos também usam os dados da API e mostram a quantidade
de exemplares cadastrados. A disponibilidade depende do futuro módulo de locações.
Execute a API na porta 8080 e o frontend com `npm start` para usar o proxy de `/api`.
Clientes e locações ainda usam dados de demonstração.

### Testes existentes

```bash
cd locadora-api && ./mvnw test
cd locadora-web && npm test -- --watch=false && npm run build
```
