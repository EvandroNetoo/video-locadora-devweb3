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

```bash
cd locadora-api && ./mvnw test
cd locadora-web && npm test -- --watch=false && npm run build
```
